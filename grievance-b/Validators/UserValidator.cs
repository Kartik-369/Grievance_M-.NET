using FluentValidation;
using grievance_b.Data;
using grievance_b.DTOs;
using Microsoft.EntityFrameworkCore;

namespace grievance_b.Validators
{
    public class UserValidator : AbstractValidator<UserDTO>
    {
        private readonly AppDbContext _context;
        public UserValidator(AppDbContext context)
        {
            _context = context;
            RuleFor(x => x.FirstName)
                .NotEmpty()
                .WithMessage("First Name is required.")
                .MaximumLength(100)
                .WithMessage("First Name cannot exceed 100 characters.");
            RuleFor(x => x.LastName).NotEmpty()
                .WithMessage("Last Name is required.")
                .MaximumLength(100)
                .WithMessage("Last Name cannot exceed 100 characters.");
            RuleFor(x => x.Email)
                .NotEmpty()
                .WithMessage("Email is required.")
                .EmailAddress()
                .WithMessage("Invalid email address.");
            RuleFor(x => x.Password)
                .NotEmpty()
                .WithMessage("Password is required.")
                .MinimumLength(6)
                .WithMessage("Password must be at least 6 characters long.");
            RuleFor(x => x.IsActive)
                .Must(x => x == true || x == false)
                .WithMessage("IsActive must be a boolean value.");
            RuleFor(x => x.RoleId)
                .MustAsync(async (roleId, cancellation) =>
                {
                    return await _context.Roles
                    .AnyAsync(
                        x => x.RoleId == roleId,
                        cancellation);
                })
                .WithMessage("Selected role is not valid.");

        }
    }
}
