using Docsera.Context;
using Docsera.DTO;
using Docsera.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MySqlX.XDevAPI.Common;

namespace Docsera.Controllers
{
    [Authorize]
    public class DoctorController : ControllerBase
    {
        private readonly DocseraDBContect _context;
        private readonly IConfiguration _configuration;

        public DoctorController(DocseraDBContect context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }


        [HttpGet("getDocAppointment")]
        public async Task<IActionResult> GetDocAppointment([FromQuery] int docId)
        {
            if (docId <= 0)
                return BadRequest(new { success = false, message = "Invalid DocId." });

            var docAppointment = await _context.AppointmentHistory
                .Where(a => a.DocId == docId)
                .ToListAsync();

            return Ok(new { success = true, data = docAppointment });
        }
        
        [AllowAnonymous]
        [HttpPost("addDoctoreReqs")]
        public async Task<IActionResult> AddDoctoreReqs([FromBody] DocReqDTO model)
        {
            if (model == null)
                return BadRequest(new { success = false, message = "Invalid request data." });

            if (string.IsNullOrWhiteSpace(model.DoctoreFirstName))
                return BadRequest(new { success = false, message = "First Name is required." });

            if (string.IsNullOrWhiteSpace(model.DoctoreLastName))
                return BadRequest(new { success = false, message = "Last Name is required." });

            if (string.IsNullOrWhiteSpace(model.Email))
                return BadRequest(new { success = false, message = "Email are required." });

            if (string.IsNullOrWhiteSpace(model.PhoneNumber))
                return BadRequest(new { success = false, message = "Phone Numberare required." });

            var docReq = new DoctorReq
            {
                DocName = model.DoctoreFirstName + model.DoctoreLastName,
                Email = model.Email,
                PhoneNumber = model.PhoneNumber,
                Decs = model.Decs,
                state = "Pending",
                Password = model.password,
                AdminMassage="",

            };

            _context.DoctorReq.Add(docReq);
            await _context.SaveChangesAsync();

            return Ok(new { success = true, message = "Request sent. Please wait for approval!" });
        }

        [HttpPost("createAppointment")]
        public async Task<IActionResult> CreateAppointment([FromBody] DocAppointmentDTO model)
        {
            if (model == null)
                return BadRequest(new { success = false, message = "Invalid request data." });

            if (model.DocId <= 0)
                return BadRequest(new { success = false, message = "Invalid Doctor data." });

            if (model.PatientId <= 0)
                return BadRequest(new { success = false, message = "Invalid Patient data." });

            if (model.Date == default(DateTime))
                return BadRequest(new { success = false, message = "Invalid or past date." });

            if (string.IsNullOrWhiteSpace(model.AppointmentDetail))
                return BadRequest(new { success = false, message = "Appointment Detail is required." });

            if (string.IsNullOrWhiteSpace(model.DocNotes))
                return BadRequest(new { success = false, message = "Doctor Notes are required." });

            var patient = await _context.User.FirstOrDefaultAsync(x => x.Id == model.PatientId);
            if (patient == null)
                return BadRequest(new { success = false, message = "Patient not found." });

            var doctor = await _context.User.FirstOrDefaultAsync(x => x.Id == model.DocId);
            if (doctor == null)
                return BadRequest(new { success = false, message = "Doctor not found." });

            var appointment = new AppointmentHistory
            {
                DocId = model.DocId,
                DocName = $"{doctor.FirstName} {doctor.LastName}",
                PatientId = model.PatientId,
                PatientName = $"{patient.FirstName} {patient.LastName}",
                Date = model.Date,
                DocNotes = model.DocNotes,
                AppointmentDetail = model.AppointmentDetail,
                PatientNotes = string.Empty
            };

            _context.AppointmentHistory.Add(appointment);
            await _context.SaveChangesAsync();

            return Ok(new { success = true, message = "Appointment added successfully!" });
        }

        [HttpPost("openDocTicket")]
        public async Task<IActionResult> openDocTicket([FromBody] openDocTicketDTO model)
        {
            if (model == null)
                return BadRequest(new { success = false, message = "Invalid request data." });

            var doctor = await _context.User.FirstOrDefaultAsync(x => x.Id == model.DocId);
            if (doctor == null)
                return BadRequest(new { success = false, message = "Doctor not found." });

            if (string.IsNullOrWhiteSpace(model.Title))
                return BadRequest(new { success = false, message = "Title is required." });

            if (string.IsNullOrWhiteSpace(model.Desc))
                return BadRequest(new { success = false, message = "Desciption is required." });


            var docTicket = new DoctorTicket
            {
                DocId = model.DocId,
                Title = model.Title,
                Desc = model.Desc,
            };

            _context.DoctorTicket.Add(docTicket);
            await _context.SaveChangesAsync();

            return Ok(new { success = true, message = "Ticket Opened successfully!" });
        }

        [HttpPut("updateAppointment")]
        public async Task<IActionResult> UpdateAppointment([FromBody] DocAppointmentDTO model)
        {
            if (model == null || model.Id <= 0)
                return BadRequest(new { success = false, message = "Invalid request data." });

            var appointment = await _context.AppointmentHistory.FirstOrDefaultAsync(a => a.Id == model.Id);
            if (appointment == null)
                return NotFound(new { success = false, message = "Appointment not found." });

            if (model.Date != default(DateTime))
                appointment.Date = model.Date;

            if (!string.IsNullOrWhiteSpace(model.AppointmentDetail))
                appointment.AppointmentDetail = model.AppointmentDetail;

            if (!string.IsNullOrWhiteSpace(model.DocNotes))
                appointment.DocNotes = model.DocNotes;

            await _context.SaveChangesAsync();

            return Ok(new { success = true, message = "Appointment updated successfully!", data = appointment });
        }


        [HttpDelete("deleteAppointment")]
        public async Task<IActionResult> DeleteAppointment([FromQuery] int appointmentId)
        {
            if (appointmentId <= 0)
                return BadRequest(new { success = false, message = "Invalid Appointment ID." });

            var appointment = await _context.AppointmentHistory.FirstOrDefaultAsync(a => a.Id == appointmentId);
            if (appointment == null)
                return NotFound(new { success = false, message = "Appointment not found." });

            _context.AppointmentHistory.Remove(appointment);
            await _context.SaveChangesAsync();

            return Ok(new { success = true, message = "Appointment deleted successfully!" });
        }


    }
}
