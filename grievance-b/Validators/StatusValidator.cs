using FluentValidation;
using grievance_b.DTOs;

namespace grievance_b.Validators
{
    public class StatusValidator : AbstractValidator<StatusDTO>
    {
        public StatusValidator() { 
            RuleFor(x => x.StatusName)
                .NotEmpty()
                .WithMessage("Status Name is required.")
                .MaximumLength(100)
                .WithMessage("Status Name cannot exceed 100 characters.");
            RuleFor(x => x.StatusCssClass)
                .NotEmpty()
                .WithMessage("Status CSS Class is required.")
                .MaximumLength(100)
                .WithMessage("Status CSS Class cannot exceed 100 characters.");

        }
    }
}
