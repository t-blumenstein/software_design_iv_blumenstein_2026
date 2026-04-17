using System.ComponentModel.DataAnnotations;
using WordGame.Server.Models;

namespace WordGame.Server.Models;

public class Game{
  [Key]
  public int Id {get; set;}
  public string UserId {get; set;}
  public ApplicationUser User {get; set;}
  public string Status {get; set;} = "Unfinished";
  public string Target {get; set;}
  public string Guesses {get; set;}
  public string View {get; set;}
  public int RemainingGuesses {get; set;} = 8;
}