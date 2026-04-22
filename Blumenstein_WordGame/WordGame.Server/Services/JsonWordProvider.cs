using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;
using Microsoft.Extensions.Hosting;
using WordGame.Server.Models;

namespace WordGame.Server.Services;

public class JsonWordProvider : IWordProvider{
    private readonly List<string> _allWords;
    private readonly Random _rnd = new();

    public JsonWordProvider(IHostEnvironment env){
        _allWords = new List<string>();
        var path = Path.Combine(env.ContentRootPath, "Assets", "wordlist.json");
        if (!File.Exists(path)) return;

        var json = File.ReadAllText(path);
        var wordList = JsonSerializer.Deserialize<WordList>(json, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
        if (wordList == null) return;

        var buckets = new[] { wordList.Easy, wordList.EasyMed, wordList.Med, wordList.MedHard, wordList.Hard };
        _allWords = buckets.Where(b => b != null).SelectMany(b => b!).Where(s => !string.IsNullOrWhiteSpace(s)).ToList();
    }

    public IReadOnlyList<string> GetAllWords() => _allWords;
    public string GetRandomWord(){
        if (_allWords.Count == 0) throw new InvalidOperationException("No words available");
        return _allWords[_rnd.Next(_allWords.Count)];
    }
}