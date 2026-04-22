using AutoMapper;
using WordGame.Server.Models;
using WordGame.Server.Models.Dtos;

namespace WordGame.Server.Mapping;

public class MappingProfile : Profile{
    public MappingProfile(){
        CreateMap<Game, GameDto>();
        CreateMap<ApplicationUser, UserDto>();
    }
}