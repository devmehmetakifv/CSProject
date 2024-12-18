namespace CSProject.Models;

public class UsersModel
{
    public int UserId { get; set; }
    public string Username { get; set; }
    public string Password { get; set; }
    public string Email { get; set; }
    public string Role { get; set; } // admin, işarayan, işveren
    public DateTime AccountCreatedTime { get; set; }
}