namespace CSProject.Models;

public class ApplicationModel
{
    public int ApplicationId { get; set; }
    public int JobSeekerId { get; set; } // Foreign Key to JobSeeker.JobSeekerId
    public int JobId { get; set; } // Foreign Key to Job.JobId
    public string Status { get; set; } // kabul, red
}