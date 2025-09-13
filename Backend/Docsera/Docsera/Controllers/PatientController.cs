using Docsera.Context;
using Docsera.DTO;
using Docsera.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Org.BouncyCastle.Utilities;
using System.Numerics;
using System.Text.Json;

namespace Docsera.Controllers
{

    [Authorize] 
    public class PatientController : ControllerBase
    {

        private readonly DocseraDBContect _context;
        private readonly IConfiguration _configuration;

        public PatientController(DocseraDBContect context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

    

        [HttpGet("getAppointmentsByPatient")]
        public async Task<IActionResult> GetAppointmentsByPatient([FromQuery] int userId)
        {
            var appointments = await _context.AppointmentHistory
                .Where(a => a.PatientId == userId)
                .OrderByDescending(a => a.Date)
                .ToListAsync();

            return Ok(appointments);
        }

        [HttpGet("GetQuestions")]
        public async Task<IActionResult> GetQuestions()
        {
            var questions = await _context.CommunityQuestion
                              .AsNoTracking()
                              .ToListAsync();
            return Ok(new { success = true, questions });

        }
        [HttpGet("me")]
        public async Task<IActionResult> GetMyProfile()
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "id");
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
                return Unauthorized(new { success = false, message = "Invalid token" });

            var user = await _context.User
                .Where(u => u.Id == userId)
                .Select(u => new
                {
                    u.Id,
                    u.FirstName,
                    u.LastName,
                    u.Email,
                    u.PhoneNumber,
                    ProfilePicture = u.ProfilePicture != null ? Convert.ToBase64String(u.ProfilePicture) : null
                })
                .FirstOrDefaultAsync();

            if (user == null)
                return NotFound(new { success = false, message = "User not found" });

            return Ok(new { success = true, user });
        }

        [HttpGet("{id}/GetReplies")]
        public async Task<IActionResult> GetReplies(int id)
        {
            var question = await _context.CommunityQuestion.FindAsync(id);
            if (question == null)
                return NotFound(new { success = false, message = "Question not found" });

            return Ok(new { success = true, replies = question.Replies });
        }

        [HttpGet("GetDoctorsToBook")]
        public async Task<IActionResult> GetDoctorsToBook()
        {
            var Doctors = await _context.User
                              .Where(x => x.UserType == "Doctor")
                              .ToListAsync();
            return Ok(new { success = true, Doctors });

        }



        [HttpPost("update-profile")]
        public async Task<IActionResult> UpdateProfile([FromForm] UpdateProfileDTO model)
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "id");
            if (userIdClaim == null)
                return Unauthorized(new { success = false, message = "Invalid token please login" });

            if (!int.TryParse(userIdClaim.Value, out int userId))
                return Unauthorized(new { success = false, message = "Invalid token please login" });

            var user = await _context.User.FirstOrDefaultAsync(u => u.Id == userId);
            if (user == null)
                return NotFound(new { success = false, message = "User not found" });

            if (!string.IsNullOrWhiteSpace(model.FirtName))
                user.FirstName = model.FirtName;

            if (!string.IsNullOrWhiteSpace(model.LastName))
                user.LastName = model.LastName;

            if (!string.IsNullOrWhiteSpace(model.Email))
                user.Email = model.Email;

            if (!string.IsNullOrWhiteSpace(model.Phone))
                user.PhoneNumber = model.Phone;

            if (!string.IsNullOrWhiteSpace(model.Password))
                user.Password = BCrypt.Net.BCrypt.HashPassword(model.Password);

            if (model.ProfilePicture != null)
            {
                using var ms = new MemoryStream();
                await model.ProfilePicture.CopyToAsync(ms);
                user.ProfilePicture = ms.ToArray();
            }

            _context.User.Update(user);
            await _context.SaveChangesAsync();

            return Ok(new { success = true, message = "Profile updated successfully" });
        }
        [HttpPost("SendContact")]
        public async Task<IActionResult> SendContactForm([FromForm] ContactFormDTO model)
        {
            if (string.IsNullOrWhiteSpace(model.Name))
                return BadRequest(new { success = false, message = "Name is Required" });
            if (string.IsNullOrWhiteSpace(model.Email))
                return BadRequest(new { success = false, message = "Email is Required" });
            if (string.IsNullOrWhiteSpace(model.Massage))
                return BadRequest(new { success = false, message = "Massage is Required" });

            var newContact = new ContactForm
            {
                Name = model.Name,
                Massage = model.Massage,
                Email = model.Email,
            };

            _context.ContactForm.Add(newContact);
            await _context.SaveChangesAsync();

            return Ok(new { success = true, message = "Sent successfuly" });


        }

        [HttpPost("saveChat")]
        public async Task<IActionResult> SaveChat([FromBody] ChatMessageDTO model)
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "id");
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
                return Unauthorized(new { success = false, message = "Invalid token" });

            if (string.IsNullOrWhiteSpace(model.Message))
                return BadRequest(new { success = false, message = "Message is required" });

            // 1️⃣ Save Chat
            var chat = new ChatHistory
            {
                PatientId = userId,
                Message = model.Message,
                CreatedAt = DateTime.UtcNow
            };

            _context.ChatHistory.Add(chat);
            await _context.SaveChangesAsync();

            // 2️⃣ Send to n8n AI Agent
            using var httpClient = new HttpClient();
            var payload = new
            {
                patientId = userId,
                message = model.Message,
                timestamp = chat.CreatedAt
            };
            var response = await httpClient.PostAsJsonAsync(
                "https://jehad.app.n8n.cloud/webhook/f8502e3b-bf73-4743-a7ae-4aa862b200b9",
                payload
            );

            var n8nResponse = await response.Content.ReadAsStringAsync();
            var parsed = JsonSerializer.Deserialize<List<Dictionary<string, JsonElement>>>(n8nResponse);
            var first = parsed?.FirstOrDefault();
            var aiMessage = first?["output"].GetString();

            // 3️ Extract and Save Appointment if AI provides it
            if (!string.IsNullOrEmpty(aiMessage))
            {
                var jsonStart = aiMessage.IndexOf("{");
                var jsonEnd = aiMessage.LastIndexOf("}");

                if (jsonStart >= 0 && jsonEnd > jsonStart)
                {
                    var jsonPart = aiMessage.Substring(jsonStart, jsonEnd - jsonStart + 1);

                    using var jsonDoc = JsonDocument.Parse(jsonPart);
                    if (jsonDoc.RootElement.TryGetProperty("appointment", out var apptElement))
                    {
                        var appointment = JsonSerializer.Deserialize<AppointmentHistoryDTO>(apptElement.GetRawText());

                        if (appointment != null)
                        {
                            var newAppointment = new AppointmentHistory
                            {
                                PatientId = userId,
                                DocId = appointment.DocId,
                                DocName = appointment.DocName,
                                PatientName = appointment.PatientName,
                                Date = appointment.Date,
                                AppointmentDetail = appointment.AppointmentDetail,
                                DocNotes = appointment.DocNotes,
                                PatientNotes = appointment.PatientNotes
                            };

                            _context.AppointmentHistory.Add(newAppointment);
                            await _context.SaveChangesAsync();
                        }
                    }
                }
            }

            return Ok(new
            {
                success = true,
                message = "Chat saved and processed by AI",
                aiResponse = aiMessage
            });
        }

        [HttpPost("CreateQuestion")]
        public async Task<IActionResult> CreateQuestion([FromBody] CommunityQuestionDTO model)
        {
            if (string.IsNullOrWhiteSpace(model.Title))
                return BadRequest(new { success = false, message = "Title is Required" });
            if (string.IsNullOrWhiteSpace(model.Description))
                return BadRequest(new { success = false, message = "Description is Required" });
            if (string.IsNullOrWhiteSpace(model.category))
                return BadRequest(new { success = false, message = "category is Required" });

            var NewQuestion = new CommunityQuestion
            {
                Title = model.Title,
                Description = model.Description,
                category = model.category,
            };

            await _context.CommunityQuestion.AddAsync(NewQuestion);
            await _context.SaveChangesAsync();
            return Ok( new
            {
                success = true,
                message = "Your Question has been added",
            });
        }

        [HttpPost("{id}/reply")]
        public async Task<ActionResult> AddReply(int id, [FromBody] string reply)
        {
            var question = await _context.CommunityQuestion.FindAsync(id);
            if (question == null) return NotFound();

            question.Replies = question.Replies.Append(reply).ToList();
            await _context.SaveChangesAsync();

            return Ok(question);
        }

        [HttpPost("AddAppointmentByPatient")]
        public async Task<IActionResult> AddAppointment([FromBody] AddAppointmentDTO model)
        {
            var doctor = await _context.User.FirstOrDefaultAsync(x => x.Id == model.DocId && x.UserType == "Doctor");
            if (doctor == null)
                return BadRequest(new { success = false, message = "Failed to find the Doctor" });

            var patient = await _context.User.FirstOrDefaultAsync(x => x.Id == model.PatientId && x.UserType == "Patient");
            if (patient == null)
                return BadRequest(new { success = false, message = "Failed to find the Patient" });

            if (model.Date < DateTime.Now)
                return BadRequest(new { success = false, message = "Date is invalid" });

            var existingAppointment = await _context.AppointmentHistory
                .AnyAsync(a => a.DocId == model.DocId && a.Date == model.Date);

            if (existingAppointment)
                return BadRequest(new { success = false, message = "This doctor already has an appointment at this time" });

            if (string.IsNullOrWhiteSpace(model.AppointmentDetail))
                return BadRequest(new { success = false, message = "Appointment Detail is Required" });
            if (string.IsNullOrWhiteSpace(model.PatientNotes))
                return BadRequest(new { success = false, message = "Patient Notes is Required" });

            var newAppointment = new AppointmentHistory
            {
                DocId = model.DocId,
                PatientId = model.PatientId,
                DocName = $"{doctor.FirstName} {doctor.LastName}",
                PatientName = $"{patient.FirstName} {patient.LastName}",
                Date = model.Date,
                AppointmentDetail = model.AppointmentDetail,
                PatientNotes = model.PatientNotes,
                DocNotes = string.Empty
            };

            _context.AppointmentHistory.Add(newAppointment);
            await _context.SaveChangesAsync();

            return Ok(new { success = true, message = "Appointment booked successfully" });
        }

        [HttpPost("{num}/AddRate")]
        public async Task<IActionResult> AddRate(int num)
        {
            var newRate = new Rate
            {
                OverAllRate = num,
              
            };

            _context.Rate.Add(newRate);
            await _context.SaveChangesAsync();

            return Ok(new { success = true, message = "Rate Added successfully" });
        }

        //[HttpGet("GetOverAllRate")]
        //public async Task<ActionResult> GetOverAllRate()
        //{
        //    var rates = await _context.Rate.ToListAsync();

        //    if (rates == null || rates.Count == 0)
        //    {
        //        return Ok(new { success = true, overallRate = 0, message = "No rates available yet" });
        //    }

        //    double average = rates.Average(r => r.OverAllRate);

        //    double scaledRate = Math.Round(average, 1);

        //    return Ok(new
        //    {
        //        success = true,
        //        overallRate = scaledRate,
        //        message = "Overall rate calculated successfully"
        //    });
        //}


    }
}


    

