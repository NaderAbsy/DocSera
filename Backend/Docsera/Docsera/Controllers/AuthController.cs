using BCrypt.Net; 
using Docsera.Context;
using Docsera.DTO;
using Docsera.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Net.Mail;
using System.Security.Claims;
using System.Text;
using System.Text.RegularExpressions;

namespace Docsera.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly DocseraDBContect _context;
        private readonly IConfiguration _configuration;

        public AuthController(DocseraDBContect context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        private string GenerateJwtToken(User user)
        {
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Email),
                new Claim("id", user.Id.ToString()),
                new Claim("firstName", user.FirstName),
                new Claim("lastName", user.LastName),
                new Claim(ClaimTypes.Role, user.UserType ?? "Patient")
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
                _configuration["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Issuer"],
                claims: claims,
                expires: DateTime.Now.AddHours(2),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private bool IsValidEmail(string email) =>
            !string.IsNullOrWhiteSpace(email) &&
            MailAddress.TryCreate(email, out _);

        private bool IsValidPhoneNumber(string phoneNumber) =>
            Regex.IsMatch(phoneNumber, @"^\d{1,10}$");


        private async Task<bool> SendConfirmationEmail(User user)
        {
            try
            {

                var frontendUrl = "http://localhost:3000/Auth/confirmEmail";
                var confirmationLink = $"{frontendUrl}?token={user.EmailConfirmationToken}&email={user.Email}";

                //var confirmationLink = Url.Action(
                //    "ConfirmEmail",
                //    "Auth",
                //    new { token = user.EmailConfirmationToken, email = user.Email },
                //    Request.Scheme
                //);

                var message = new MailMessage();
                message.To.Add(user.Email);
                message.Subject = "Confirm your email";
                message.Body = $"Hello {user.FirstName},<br>Please confirm your email by clicking <a href='{confirmationLink}'>here</a>.";
                message.IsBodyHtml = true;



                using (var smtpClient = new System.Net.Mail.SmtpClient("smtp.gmail.com", 587))
                {
                    smtpClient.EnableSsl = true;
                    smtpClient.Credentials = new NetworkCredential("docsera159@gmail.com", "krto swae fccn tlju");

                    var mailMessage = new MailMessage
                    {
                        From = new MailAddress("docsera159@gmail.com", "docsera Team"),
                        Subject = "Contact Form Web",
                        Body = $"Hello {user.FirstName},<br>Please confirm your email by clicking <a href='{confirmationLink}'>here</a>.",
                        IsBodyHtml = true,
                    };
                    mailMessage.To.Add(user.Email);
                    await smtpClient.SendMailAsync(mailMessage);
                    return true;
                }

            }
            catch (Exception ex)
            {
                // Log the error for debugging
                Console.WriteLine("SMTP error: " + ex.Message);
                return false;
            }
        }


        [HttpGet("confirm-email")]
        public async Task<IActionResult> ConfirmEmail(string token, string email)
        {
            var user = await _context.User.FirstOrDefaultAsync(u => u.Email == email && u.EmailConfirmationToken == token);
            if (user == null)
                return BadRequest(new { success = false, message = "Invalid email confirmation link" });

            user.EmailConfirmed = true;
            //user.EmailConfirmationToken = null; 
            await _context.SaveChangesAsync();

            return Ok(new { success = true, message = "Email confirmed successfully! You can now login." });
        }



        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDTO model)
        {
            if (model.Password != model.ConfirmPass)
                return BadRequest(new { success = false, message = "Passwords do not match" });

            if (model.Password.Length < 8 || !model.Password.Any(ch => !char.IsLetterOrDigit(ch)))
                return BadRequest(new { success = false, message = "Password must be at least 8 characters and contain a special character" });

            if (!IsValidEmail(model.Email))
                return BadRequest(new { success = false, message = "Not a valid Email!" });

            if (!IsValidPhoneNumber(model.PhoneNumber))
                return BadRequest(new { success = false, message = "Not a valid Phone Number" });

            if (await _context.User.AnyAsync(u => u.Email == model.Email))
                return BadRequest(new { success = false, message = "Email already registered" });

            if (await _context.User.AnyAsync(u => u.PhoneNumber == model.PhoneNumber))
                return BadRequest(new { success = false, message = "Phone number already registered" });

            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(model.Password);

            var newUser = new User
            {
                FirstName = model.FirstName,
                LastName = model.LastName,
                Email = model.Email,
                PhoneNumber = model.PhoneNumber,
                Password = hashedPassword,
                UserType = model.UserType,
                EmailConfirmed = false,
                EmailConfirmationToken = Guid.NewGuid().ToString()
            };

            _context.User.Add(newUser);
            await _context.SaveChangesAsync();

            //await SendConfirmationEmail(newUser);

            bool emailSent = await SendConfirmationEmail(newUser);

            if (!emailSent)
                return StatusCode(500, new { success = false, message = "Registration successful but failed to send confirmation email. Please contact support." });

            return Ok(new { success = true, message = "Registration successful Check Your Email !" });
        }
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDTO model)
        {
            try
            {
                var user = await _context.User
                    .FirstOrDefaultAsync(u => u.Email == model.EmailOrPhone || u.PhoneNumber == model.EmailOrPhone);

                if (user == null || string.IsNullOrEmpty(user.Password))
                    return Unauthorized(new { success = false, message = "Invalid credentials" });

                bool verified = false;
                try
                {
                    verified = BCrypt.Net.BCrypt.Verify(model.Password, user.Password);
                }
                catch
                {
                    return Unauthorized(new { success = false, message = "Invalid credentials" });
                }

                if (!verified)
                    return Unauthorized(new { success = false, message = "Invalid credentials" });


                // TODO:SMTP SendEmail if email confirmation is required
                if (!user.EmailConfirmed)
                    return Unauthorized(new { success = false, message = "Email not confirmed" });

                user.IsLogedIn=true;

                var token = GenerateJwtToken(user);

                return Ok(new
                {
                    success = true,
                    message = "Login successful",
                    token,
                    user = new
                    {
                        user.Id,
                        user.FirstName,
                        user.LastName,
                        user.Email,
                        user.UserType,
                        
                    }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

    }
}
