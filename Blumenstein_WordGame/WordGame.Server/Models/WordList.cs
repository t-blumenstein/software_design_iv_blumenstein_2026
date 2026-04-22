using System.Text.Json.Serialization;

namespace WordGame.Server.Models;

public class WordList
{
    [JsonPropertyName("easy")]
    public List<string> Easy { get; set; } = new();

    [JsonPropertyName("easy_med")]
    public List<string> EasyMed { get; set; } = new();

    [JsonPropertyName("med")]
    public List<string> Med { get; set; } = new();

    [JsonPropertyName("med_hard")]
    public List<string> MedHard { get; set; } = new();

    [JsonPropertyName("hard")]
    public List<string> Hard { get; set; } = new();
}