using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.Models;

namespace MyApp.Namespace
{
    [Route("api/[controller]")]
    [ApiController]
    public class MoviesController : ControllerBase{
        private readonly ApplicationDbContext _context;

        public MoviesController(ApplicationDbContext context){
            _context = context;
        }

        //Get all movies
        [HttpGet("")]
        public async Task<ActionResult<ICollection<Movie>>> GetMovies() {
            return Ok(await _context.Movies.ToListAsync());
        }

        //Get movie by ID 
        [HttpGet("{MovieId}")]
        public async Task<ActionResult<Movie>> GetMovieById(int MovieId){

            Movie? movie = await _context.Movies.FindAsync(MovieId);

            if(null == movie){
                return NotFound($"Movie with the ID of {MovieId} does not exist");
            }

            return Ok(movie);
        }

        [HttpGet("search")]
        public async Task<ActionResult<List<Movie>>> SearchMovies([FromQuery] string? title){
            var normalized = title?.Trim().ToLower();

            var matches = await _context.Movies
                .Where(m => m.Title != null && m.Title.ToLower().Contains(normalized))
                .ToListAsync();

            return Ok(matches);
        }
    }
}
