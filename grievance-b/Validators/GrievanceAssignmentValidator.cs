using FluentValidation;
using grievance_b.Data;
using grievance_b.DTOs;
using Microsoft.EntityFrameworkCore;

namespace grievance_b.Validators
{
    public class GrievanceAssignmentValidator : AbstractValidator<GrievanceAssignmentDTO>
    {
        private readonly AppDbContext _context;

        public GrievanceAssignmentValidator(AppDbContext context)
        {
            _context = context;

            RuleFor(x => x.GrievanceId)
                .GreaterThan(0)
                .WithMessage("Valid Grievance ID is required.")
                .MustAsync(async (grievanceId, cancellation) =>
                {
                    return await _context.Grievances.AnyAsync(x => x.GrievanceId == grievanceId, cancellation);
                })
                .WithMessage("Selected grievance does not exist.");

            RuleFor(x => x.AssignedTo)
                .GreaterThan(0)
                .WithMessage("Valid User ID is required.")
                .MustAsync(async (userId, cancellation) =>
                {
                    return await _context.Users.AnyAsync(x => x.UserId == userId, cancellation);
                })
                .WithMessage("Selected user does not exist.");
        }
    }
}
