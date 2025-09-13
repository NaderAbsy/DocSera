using Docsera.Context;
using Docsera.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Docsera.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class AdminController : Controller
    {
        private readonly DocseraDBContect _context;
        private readonly IConfiguration _configuration;

        public AdminController(DocseraDBContect context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }


        [HttpGet("getAllDoctores")]
        public async Task<IActionResult> GetAllDoctores([FromQuery] string? firstName, [FromQuery] string? lastName, [FromQuery] string? email, [FromQuery] string? phoneNumber)
        {
            var query = _context.User
                .Where(x => (x.UserType ?? "").ToLower() == "doctor")
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(firstName))
                query = query.Where(x => x.FirstName.Contains(firstName));

            if (!string.IsNullOrWhiteSpace(lastName))
                query = query.Where(x => x.LastName.Contains(lastName));

            if (!string.IsNullOrWhiteSpace(email))
                query = query.Where(x => x.Email.Contains(email));
            if (!string.IsNullOrWhiteSpace(phoneNumber))
                query = query.Where(x => x.Email.Contains(phoneNumber));

            var allDocs = await query.ToListAsync();

            var result = allDocs.Select(d => new
            {
                d.Id,
                d.FirstName,
                d.LastName,
                d.Email,
                d.PhoneNumber,
                ProfilePicUrl = d.ProfilePicture != null
                    ? $"data:image/png;base64,{Convert.ToBase64String(d.ProfilePicture)}"
                    : null
            });

            return Ok(new { success = true, data = result });
        }


        [HttpGet("getAllPatients")]
        public async Task<IActionResult> GetAllPatients([FromQuery] string? firstName, [FromQuery] string? lastName, [FromQuery] string? email, [FromQuery] string? phoneNumber)
        {
            var query = _context.User
                .Where(x => (x.UserType ?? "").ToLower() == "patient")
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(firstName))
                query = query.Where(x => x.FirstName.Contains(firstName));

            if (!string.IsNullOrWhiteSpace(lastName))
                query = query.Where(x => x.LastName.Contains(lastName));

            if (!string.IsNullOrWhiteSpace(email))
                query = query.Where(x => x.Email.Contains(email));
            if (!string.IsNullOrWhiteSpace(phoneNumber))
                query = query.Where(x => x.Email.Contains(phoneNumber));

            var AllPatients = await query.ToListAsync();

            var result = AllPatients.Select(d => new
            {
                d.Id,
                d.FirstName,
                d.LastName,
                d.Email,
                d.PhoneNumber,
                ProfilePicUrl = d.ProfilePicture != null
                    ? $"data:image/png;base64,{Convert.ToBase64String(d.ProfilePicture)}"
                    : null
            });

            return Ok(new { success = true, data = result });
        }

        [HttpGet("GetOverAllRate")]
        public async Task<ActionResult> GetOverAllRate()
        {
            var rates = await _context.Rate.ToListAsync();

            if (rates == null || rates.Count == 0)
            {
                return Ok(new
                {
                    success = true,
                    overallRate = 0,
                    starCounts = new { one = 0, two = 0, three = 0, four = 0, five = 0 },
                    message = "No rates available yet"
                });
            }

            double average = rates.Average(r => r.OverAllRate);
            double scaledRate = Math.Round(average, 1);

            // Count how many of each star
            var starCounts = new
            {
                one = rates.Count(r => r.OverAllRate == 1),
                two = rates.Count(r => r.OverAllRate == 2),
                three = rates.Count(r => r.OverAllRate == 3),
                four = rates.Count(r => r.OverAllRate == 4),
                five = rates.Count(r => r.OverAllRate == 5)
            };

            return Ok(new
            {
                success = true,
                overallRate = scaledRate,
                starCounts,
                message = "Overall rate calculated successfully"
            });
        }

        [HttpGet("viewDoctoreSubmition")]
        public async Task<IActionResult> ViewDoctoreReqs()
        {
            
           var allReqs = await _context.DoctorReq.ToListAsync();
            if (allReqs == null || allReqs.Count == 0)
                return BadRequest(new { success = false, message = "No Requsts found" });

            return Ok(allReqs);
        }

        [HttpGet("viewDoctoreSubmitionBuId")]
        public async Task<IActionResult> ViewDoctoreSubmitionBuId(int id)
        {

            var Req = await _context.DoctorReq.Where(x=>x.Id == id).FirstOrDefaultAsync();
            if (Req == null )
                return BadRequest(new { success = false, message = "No Requsts found" });

            return Ok(Req);
        }

        [HttpGet("viewApprovalDoctoreReqs")]
        public async Task<IActionResult> ViewApprovalDoctoreReqs()
        {

            var allReqs = await _context.DoctorReq.Where(x=>x.state== "Approved").ToListAsync();
            if (allReqs == null || allReqs.Count == 0)
                return BadRequest(new { success = false, message = "No Requsts found" });

            return Ok(allReqs);
        }

        [HttpGet("viewDeclinedlDoctoreReqs")]

        public async Task<IActionResult> ViewDeclinedlDoctoreReqs()
        {

            var allReqs = await _context.DoctorReq.Where(x => x.state == "Declined").ToListAsync();
            if (allReqs == null || allReqs.Count == 0)
                return BadRequest(new { success = false, message = "No Requsts found" });

            return Ok(allReqs);
        }

        [HttpPost("handelDoctoreReqs")]

        public async Task<IActionResult> HandelDoctoreReqs(int id, string state, string adminMassage)
        {
            var ReqToBeHandel = await _context.DoctorReq.FirstOrDefaultAsync(x => x.Id == id);
            if (ReqToBeHandel == null)
            {
                return BadRequest(new { success = false, message = "Something went wrong" });
            }

            bool updated = false;

            if (!string.IsNullOrWhiteSpace(state))
            {
                ReqToBeHandel.state = state;
                updated = true;
            }

            if (!string.IsNullOrWhiteSpace(adminMassage))
            {
                ReqToBeHandel.AdminMassage = adminMassage;
                updated = true;
            }

            if (updated)
            {
                _context.DoctorReq.Update(ReqToBeHandel);
                await _context.SaveChangesAsync();
                if(state == "Approved")
                {
                    string hashedPassword = BCrypt.Net.BCrypt.HashPassword(ReqToBeHandel.Password);

                    var NewDoc = new User
                    {
                        FirstName = ReqToBeHandel.DocName,
                        LastName = " ",
                        Email = ReqToBeHandel.Email,
                        PhoneNumber = ReqToBeHandel.PhoneNumber,
                        Password = hashedPassword,
                        UserType = "Doctor",
                        EmailConfirmed = true,
                        EmailConfirmationToken = Guid.NewGuid().ToString()
                    };
                    _context.User.Add(NewDoc);
                   await _context.SaveChangesAsync();
                }
                return Ok(new { success = true, message = "Done" });
            }

            return Ok(new { success = true, message = "No Updates" });
        }

        [HttpDelete("deleteDoctore/{id}")]
        public async Task<IActionResult> DeleteDoctore(int id)
        {
            var doc = await _context.User.FirstOrDefaultAsync(x => x.Id == id && x.UserType.ToLower() == "doctor");
            if (doc == null)
                return Ok(new { success = false, message = "Doctor not found" });

            _context.User.Remove(doc);
            await _context.SaveChangesAsync();

            return Ok(new { success = true, message = "Doctor deleted successfully" });
        }


        [HttpDelete("deletePatient/{id}")]
        public async Task<IActionResult> DletePatient(int id)
        {
            var doc = await _context.User.FirstOrDefaultAsync(x => x.Id == id && x.UserType.ToLower() == "Patient");
            if (doc == null)
                return Ok(new { success = false, message = "Patient not found" });

            _context.User.Remove(doc);
            await _context.SaveChangesAsync();

            return Ok(new { success = true, message = "Patient deleted successfully" });
        }


    }
}
