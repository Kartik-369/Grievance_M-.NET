using FluentValidation;
using grievance_b.DTOs;

namespace grievance_b.Validators
{
    public class PriorityValidator : AbstractValidator<PriorityDTO>
    {
        public PriorityValidator()
        {
            RuleFor(x => x.PriorityName)
                .NotEmpty()
                .WithMessage("Priority Name is required.")
                .MaximumLength(50)
                .WithMessage("Priority Name cannot exceed 50 characters.");
            
            RuleFor(x => x.PriorityCssClass)
                .MaximumLength(50)
                .WithMessage("CSS Class Name cannot exceed 50 characters.");
        }
    }
}
