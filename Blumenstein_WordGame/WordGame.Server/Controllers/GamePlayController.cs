using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using WordGame.Server.Data;
using WordGame.Server.Models;
using WordGame.Server.Models.Dtos;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace WordGame.Server.Controllers {
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class GamePlayController : ControllerBase {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly WordGame.Server.Services.IWordProvider _wordProvider;

        public GamePlayController(ApplicationDbContext context,
                                  IMapper mapper,
                                  UserManager<ApplicationUser> userManager,
                                  WordGame.Server.Services.IWordProvider wordProvider)
        {
            _context = context;
            _mapper = mapper;
            _userManager = userManager;
            _wordProvider = wordProvider;
        }


        [HttpGet("games")]
        public async Task<ActionResult<List<GameDto>>> GetAllGames(){
            var userId = _userManager.GetUserId(User);
            if(string.IsNullOrEmpty(userId)){
                return Unauthorized();
            }

            var games = await _context.Games
                .Where(g => g.UserId == userId)
                .ToListAsync();

            var dtos = _mapper.Map<List<GameDto>>(games);
            return Ok(dtos);
        }

        [HttpGet("games/{id}")]
        public async Task<ActionResult<GameDto>> GetGameById(int id){
            var userId = _userManager.GetUserId(User);
            if(string.IsNullOrEmpty(userId)){
                return Unauthorized();
            }

            var game = await _context.Games.FindAsync(id);
            if(game == null || game.UserId != userId){
                return NotFound();
            }

            var dto = _mapper.Map<GameDto>(game);

            return Ok(dto);
        }

        [HttpPost("games")]
        public async Task<ActionResult<GameDto>> CreateGame(){
            var userId = _userManager.GetUserId(User);
            if(string.IsNullOrEmpty(userId)){
                return Unauthorized();
            }

            var target = _wordProvider.GetRandomWord();
            if(string.IsNullOrWhiteSpace(target)){
                return BadRequest("No words available");
            }

            var game = new Game {
                UserId = userId,
                Status = "Unfinished",
                Target = target,
                Guesses = string.Empty,
                View = new string('_', target.Length),
                RemainingGuesses = 8
            };

            _context.Games.Add(game);
            await _context.SaveChangesAsync();

            var dto = _mapper.Map<GameDto>(game);

            return CreatedAtAction(nameof(GetGameById), new {id = game.Id}, dto);
        }

        [HttpPost("games/{gameId}/guesses")]
        public async Task<ActionResult<GameDto>> MakeGuess(int gameId, [FromQuery] string? guess){
            if(string.IsNullOrWhiteSpace(guess) || guess.Length != 1){
                return BadRequest("Provide a single character as a guess.");
            }

            var userId = _userManager.GetUserId(User);
                if(string.IsNullOrEmpty(userId)){
                    return Unauthorized();
                }
            

            var game = await _context.Games.FindAsync(gameId);
            if(game == null || game.UserId != userId){
                return NotFound();
            }

            if(game.Status == "Finished" || game.Status == "Won" || game.Status == "Lost"){
                return BadRequest("Game already finished");
            }

            char letter = char.ToLowerInvariant(guess[0]);

                    //TODO Ask what this guessed does.
            var guessed = new HashSet<char>(
                (game.Guesses ?? string.Empty)
                    .Split(new[] {','}, StringSplitOptions.RemoveEmptyEntries)
                    .Select(s => char.ToLowerInvariant(s[0]))
            );

            if(guessed.Contains(letter)){
                return BadRequest("Letter already guessed.");
            }

            guessed.Add(letter);
            game.Guesses = string.Join(',', guessed);

            var target = game.Target ?? string.Empty;

            var newViewChars = target
                .Select(c => guessed.Contains(char.ToLowerInvariant(c)) ? c : '_')
                .ToArray();
            game.View = new string(newViewChars);

            if(!target.ToLowerInvariant().Contains(letter)){
                game.RemainingGuesses = Math.Max(0, game.RemainingGuesses - 1);
            }

            if(!game.View.Contains('_')){
                game.Status = "Won";
            }else if(game.RemainingGuesses <= 0){
                game.Status = "Lost";
            }else{
                game.Status = "InProgress";
            }

            await _context.SaveChangesAsync();

            var dto = _mapper.Map<GameDto>(game);

            return Ok(dto);
        }

        [HttpDelete("games/{gameId}")]
        public async Task<ActionResult<List<GameDto>>> DeleteGame(int gameId){
            var userId = _userManager.GetUserId(User);
                if(string.IsNullOrEmpty(userId)){
                    return Unauthorized();
                }    

            var game = await _context.Games.FindAsync(gameId);
            if(game == null || game.UserId != userId){
                return NotFound();
            }   

            _context.Games.Remove(game);
            await _context.SaveChangesAsync();

            var remaining = await _context.Games
                .Where(g => g.UserId == userId)
                .ToListAsync();

            var dtos = _mapper.Map<List<GameDto>>(remaining);

            return Ok(dtos); 
        }
    }
}
