using FluentValidation;
using grievance_b.DTOs;

namespace grievance_b.Validators
{
    public class GrievanceCategoryValidator : AbstractValidator<GrievanceCategoryDTO>
    {
        public GrievanceCategoryValidator()
        {
            RuleFor(x => x.CategoryName)
                .NotEmpty()
                .WithMessage("Category Name is required.")
                .MaximumLength(100)
                .WithMessage("Category Name cannot exceed 100 characters.");
            
            RuleFor(x => x.CssClassName)
                .MaximumLength(50)
                .WithMessage("CSS Class Name cannot exceed 50 characters.");
        }
    }
}
