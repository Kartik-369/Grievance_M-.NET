using FluentValidation;
using grievance_b.Data;
using grievance_b.DTOs;
using Microsoft.EntityFrameworkCore;

namespace grievance_b.Validators
{
    public class GrievanceValidator : AbstractValidator<GrievanceDTO>
    {
        private readonly AppDbContext _context;

        public GrievanceValidator(AppDbContext context)
        {
            _context = context;

            RuleFor(x => x.Title)
                .NotEmpty()
                .WithMessage("Title is required.")
                .MaximumLength(200)
                .WithMessage("Title cannot exceed 200 characters.");

            RuleFor(x => x.Description)
                .NotEmpty()
                .WithMessage("Description is required.");

            RuleFor(x => x.RaisedBy)
                .GreaterThan(0)
                .WithMessage("Valid RaisedBy User ID is required.")
                .MustAsync(async (userId, cancellation) =>
                {
                    return await _context.Users.AnyAsync(x => x.UserId == userId, cancellation);
                })
                .WithMessage("Selected user does not exist.");

            RuleFor(x => x.CategoryId)
                .GreaterThan(0)
                .WithMessage("Valid Category ID is required.")
                .MustAsync(async (categoryId, cancellation) =>
                {
                    return await _context.GrievanceCategories.AnyAsync(x => x.CategoryId == categoryId, cancellation);
                })
                .WithMessage("Selected category does not exist.");

            RuleFor(x => x.StatusId)
                .GreaterThan(0)
                .WithMessage("Valid Status ID is required.")
                .MustAsync(async (statusId, cancellation) =>
                {
                    return await _context.Status.AnyAsync(x => x.StatusID == statusId, cancellation);
                })
                .WithMessage("Selected status does not exist.");

            RuleFor(x => x.PriorityId)
                .GreaterThan(0)
                .WithMessage("Valid Priority ID is required.")
                .MustAsync(async (priorityId, cancellation) =>
                {
                    return await _context.Priority.AnyAsync(x => x.PriorityId == priorityId, cancellation);
                })
                .WithMessage("Selected priority does not exist.");
        }
    }
}
