using Microsoft.AspNetCore.Mvc;
using grievance_b.DTOs;
using FluentValidation;
namespace grievance_b.Validators
{
    public class RoleValidator: AbstractValidator<RoleDTO>
    {
        public RoleValidator() { 
            RuleFor(x=>x.RoleName)
                .NotEmpty()
                .WithMessage("Role name is required.")
                .Must(name => !string.IsNullOrWhiteSpace(name))
                .WithMessage("Role name cannot be empty or whitespace.")
                .Must(name=>!name.Any(char.IsDigit))
                .WithMessage("Role name cannot contain digits.");

            RuleFor(x=> x.Description)
                .NotEmpty()
                .WithMessage("Role Description is required.")
                .MaximumLength(500)
                .WithMessage("Description cannot exceed 500 characters.");
        }
    }
}
