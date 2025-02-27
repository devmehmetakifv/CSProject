namespace CSProject.Models;

using Microsoft.AspNetCore.Identity;

public class ApplicationUser : IdentityUser
{
    // Ek özellikler (isteğe bağlı)
    public string FullName { get; set; }
}
