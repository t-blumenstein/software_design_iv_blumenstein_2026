using System.Collections.Generic;

namespace WordGame.Server.Services;

public interface IWordProvider{
    IReadOnlyList<string> GetAllWords();
    string GetRandomWord();
}