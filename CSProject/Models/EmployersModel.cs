namespace CSProject.Models;

public class EmployersModel
{
    public int EmployerId { get; set; } // Foreign Key to User.UserId
    public string EmployerFullname { get; set; }
    public string CompanyName { get; set; }
    public string CompanyDescription { get; set; }
    public string EmployerNumber { get; set; } 
}