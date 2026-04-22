using AutoMapper;
using WordGame.Server.Models;
using WordGame.Server.Models.Dtos;

namespace WordGame.Server.Mapping;

public class MappingProfile : Profile{
    public MappingProfile(){
        // Only expose Target in the DTO when the game has finished (Won or Lost).
        CreateMap<Game, GameDto>()
            .ForMember(dest => dest.Target, opt => opt.MapFrom(src => (src.Status == "Won" || src.Status == "Lost") ? src.Target : null));

        CreateMap<ApplicationUser, UserDto>();
    }
}