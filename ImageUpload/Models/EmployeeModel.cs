using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ImageUpload.Models
{
    public class EmployeeModel
    {
        [Key]
        public int EmployeeId { get; set; }
        [Column(TypeName ="nvarchar(50)")]
        public string EmployeeName { get; set; }
        [Column(TypeName = "nvarchar(50)")]
        public string Occupation { get; set; }
        [Column(TypeName = "nvarchar(100)")]
        [Required(AllowEmptyStrings =true), DisplayFormat(ConvertEmptyStringToNull=false)]

        public string? ImageName { get; set; }
        [NotMapped]
        public IFormFile ImageFile { get; set; }  //this is a helper proprty created becouse in react we send formData class where we have ImageFile property 
        [NotMapped]
        public string ImageSrc { get; set; }  //this property correspond with ImageSrc property from react form. we need this to use GET method



    }
}
