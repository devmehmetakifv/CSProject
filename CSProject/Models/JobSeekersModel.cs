namespace CSProject.Models;

public class JobSeekersModel
{
    public int JobSeekerId { get; set; } // Foreign Key to User.UserId
    public string JobSeekerFullname { get; set; }
    public DateTime JobSeekeBirthday { get; set; }
    public string Resume { get; set; } // Özgeçmiş dosya yolu
    public string Experience { get; set; } // İş deneyimi bilgileri
}