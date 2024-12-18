namespace CSProject.Models;

public class JobsModel
{
    public int JobId { get; set; }
    public int EmployerId { get; set; } // Foreign Key to Employer.EmployerId
    public string Title { get; set; } 
    public string Description { get; set; } 
    public string Location { get; set; } 
    public decimal Salary { get; set; } 
    public DateTime JobCreatedTime { get; set; } 
    public DateTime? ExpiresTime { get; set; } 
}