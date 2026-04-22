using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using WordGame.Server.Data;
using WordGame.Server.Models;
using WordGame.Server.Services;
using WordGame.Server.Mapping;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite(connectionString));
builder.Services.AddDatabaseDeveloperPageExceptionFilter();

builder.Services.AddDefaultIdentity<ApplicationUser>(options => options.SignIn.RequireConfirmedAccount = false)
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();

builder.Services.AddControllersWithViews();

builder.Services.AddAutoMapper(typeof(MappingProfile)); // see mapping profile below
builder.Services.AddSingleton<WordGame.Server.Services.IWordProvider, WordGame.Server.Services.JsonWordProvider>();


/*
    In a default dotnet project created with Identity, this will be
    AddControllersWithViews() instead of the AddControllers() call
    seen below. Keeping AddControllersWithViews() is fine and will not
    interfere with anything. The AddControllersWithViews() tells dotnet
    that it will use the Razor pages for the frontend. Since we are just
    using dotnet as a backend API, all we need is the controller
    feature, not the fronted Razor pages.
*/
builder.Services.AddControllers();

// Retrieve JWT settings from appsettings.json
string? jwtKey = builder.Configuration["Jwt:Key"];
string? jwtIssuer = builder.Configuration["Jwt:Issuer"];
string? jwtAudience = builder.Configuration["Jwt:Audience"];
string? jwtExpiresInMinutesRaw = builder.Configuration["Jwt:ExpiresInMinutes"];

// Validate required JWT config up front
if (string.IsNullOrWhiteSpace(jwtKey)) {
    throw new InvalidOperationException("Jwt:Key is not configured.");
}

if (string.IsNullOrWhiteSpace(jwtIssuer)) {
    throw new InvalidOperationException("Jwt:Issuer is not configured.");
}

if (string.IsNullOrWhiteSpace(jwtAudience)) {
    throw new InvalidOperationException("Jwt:Audience is not configured.");
}

if (!double.TryParse(jwtExpiresInMinutesRaw, out double jwtExpiresInMinutes)) {
    throw new InvalidOperationException("Jwt:ExpiresInMinutes is missing or invalid.");
}

/* 
    Use the JWT settings object we made. By adding it here
    in the service container, this allows the JwtSettings object
    to be used by the dependency injection system. Tells
    it to:
        - Create and manage a JwtSettings options object
        - Fill it with these values
        - Make it available for injection as IOptions<JwtSettings>
    
    So now, in the AuthController, we are able to dependency inject
    the JwtSettings object, and it will be filled with the values
    that we have set in the appsettings.json file. If we did not
    do the below code adding to the service container, then
    in the AuthController, we would just have to read from the 
    appsettings.json directly and get these values. That is
    not necessarily wrong, but it is more streamlined to just
    set the values here in the Program.cs and make available
    to the application more broadly.
*/
builder.Services.Configure<JwtSettings>(options => {
    options.Key = jwtKey;
    options.Issuer = jwtIssuer;
    options.Audience = jwtAudience;
    options.ExpiresInMinutes = jwtExpiresInMinutes;
});

// JWT authentication
builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options => {
        options.TokenValidationParameters = new TokenValidationParameters {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtIssuer,
            ValidAudience = jwtAudience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
            ClockSkew = TimeSpan.Zero
        };
    });

builder.Services.AddAuthorization();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseMigrationsEndPoint();
}
else
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.MapStaticAssets();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}")
    .WithStaticAssets();

app.MapRazorPages()
   .WithStaticAssets();

app.Run();
