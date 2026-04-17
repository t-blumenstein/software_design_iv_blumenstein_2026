using System.ComponentModel.DataAnnotations;

namespace WordGame.Server.Models;

public class EmailLoginDetails {
  [Required]
  [EmailAddress]
  public string? Email {get; set;}
  [Required]
  public string? Password {get; set;}
  [Compare("Password")]
  public string? ConfirmPassword {get; set;}
  [Required]
  public string? UserName {get; set;}
  public bool RememberMe {get; set;}
}