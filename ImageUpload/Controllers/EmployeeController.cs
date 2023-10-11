using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ImageUpload.Models;

namespace ImageUpload.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeeController : ControllerBase
    {
        private readonly EmployeeDbContext _context;
        private readonly IWebHostEnvironment _webHostEnvironment;

        public EmployeeController(EmployeeDbContext context, IWebHostEnvironment webHostEnvironment)
        {
            _context = context;
            _webHostEnvironment = webHostEnvironment;
        }

        // GET: api/Employee
        [HttpGet]
        public async Task<ActionResult<IEnumerable<EmployeeModel>>> GetEmployees()
        {
            var data =  await _context.Employees.Select(x => new EmployeeModel()
            {
                EmployeeId = x.EmployeeId,
                EmployeeName = x.EmployeeName,
                Occupation = x.Occupation,
                ImageName = x.ImageName,
                ImageSrc = String.Format("{0}://{1}{2}/images/{3}", Request.Scheme, Request.Host, Request.PathBase, x.ImageName), //we rebuild the http path to our folder with photos here.In our entity or database we dont have path to folder where we stored photo adress so in order to use GET method we must create such property. Request.Scheme returns values http or https. Request.Host returns domain in development localhost//73456 -port number. Request.PathBase returns usually is empty if you have alias on website this is where it belongs. x.ImageName returns the image name in our folder
            }).ToListAsync();
            return Ok(data);
        }

        // GET: api/Employee/5
        [HttpGet("{id}")]
        public async Task<ActionResult<EmployeeModel>> GetEmployeeModel(int id)
        {
            var employeeModel = await _context.Employees.FindAsync(id);

            if (employeeModel == null)
            {
                return NotFound();
            }

            return employeeModel;
        }

        

        // PUT: api/Employee/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutEmployeeModel(int id,[FromForm] EmployeeModel employeeModel)
        {
            if (id != employeeModel.EmployeeId)
            {
                return BadRequest();
            }

            if(employeeModel.ImageFile != null) //here we want to check if the photo during the update was changed . if this field ImageFile is not null it means the photo was changed
            {
                DeleteImage(employeeModel.ImageName);
                employeeModel.ImageName = await SaveImage(employeeModel.ImageFile); //saving new updated image to database
            }

            _context.Entry(employeeModel).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EmployeeModelExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Employee
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<EmployeeModel>> PostEmployeeModel([FromForm] EmployeeModel employeeModel)
        {
            employeeModel.ImageName = await SaveImage(employeeModel.ImageFile); //before image to sql server we need to update corresponding imageName here
            await _context.Employees.AddAsync(employeeModel);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [NonAction] //no CRUD method
        public async Task<string> SaveImage(IFormFile imageFile)
        {
            string imageName =new String(Path.GetFileNameWithoutExtension(imageFile.FileName).Take(10).ToArray()).Replace(" ","-");
            imageName = imageName + DateTime.Now.ToString("yymmssfff")+Path.GetExtension(imageFile.FileName);  // "yymmssfff" - it means save date to string adding year month seconds and miliseconds
            var imagePath = Path.Combine(_webHostEnvironment.ContentRootPath, "images", imageName); //here we created a path to the folder where we stored our images
            using(var fileStream = new FileStream(imagePath, FileMode.Create))
            {
                await imageFile.CopyToAsync(fileStream);
            } 
            return imageName;
        }

        [NonAction]
        public void DeleteImage(string imageName)
        {
            var imagePath = Path.Combine(_webHostEnvironment.ContentRootPath, "images", imageName); //here we created a path to the folder where we stored our images
            if(System.IO.File.Exists(imagePath)) //checking if the file under this path exist
            {
                System.IO.File.Delete(imagePath); //deleting the file
            }
        }

        // DELETE: api/Employee/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEmployeeModel(int id)
        {
            var employeeModel = await _context.Employees.FindAsync(id);
            if (employeeModel == null)
            {
                return NotFound();
            }
            DeleteImage(employeeModel.ImageName);

            _context.Employees.Remove(employeeModel);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool EmployeeModelExists(int id)
        {
            return _context.Employees.Any(e => e.EmployeeId == id);
        }
    }
}
