namespace WordGame.Server.Models.Dtos;

public class GameDto {
  public int Id {get; set;}
  public string UserId {get; set;}
  public string Status {get; set;}
  public int RemainingGuesses {get; set;} = 8;
  public string View { get; set; }
  public string Guesses { get; set; }
  public string Target { get; set; }
}