using FluentValidation;
using grievance_b.Data;
using grievance_b.DTOs;
using Microsoft.EntityFrameworkCore;

namespace grievance_b.Validators
{
    public class GrievanceStatusHistoryValidator : AbstractValidator<GrievanceStatusHistoryDTO>
    {
        private readonly AppDbContext _context;

        public GrievanceStatusHistoryValidator(AppDbContext context)
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

            RuleFor(x => x.Status)
                .GreaterThan(0)
                .WithMessage("Valid Status ID is required.")
                .MustAsync(async (statusId, cancellation) =>
                {
                    return await _context.Status.AnyAsync(x => x.StatusID == statusId, cancellation);
                })
                .WithMessage("Selected status does not exist.");

            RuleFor(x => x.Remarks)
                .MaximumLength(500)
                .WithMessage("Remarks cannot exceed 500 characters.");
            
            RuleFor(x => x.UpdatedBy)
                .GreaterThan(0)
                .WithMessage("Valid UpdatedBy User ID is required.");
        }
    }
}
