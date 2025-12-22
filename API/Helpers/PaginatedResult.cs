
namespace API.Helpers;
using Microsoft.EntityFrameworkCore;
 

public class PaginatedResult<T>
{
    public PaginationMetaData Metadata { get; set; } = default!;
    public List<T> Items { get; set; } = [];

};

public class PaginationMetaData
{
    public int CurrentPage { get; set; }
    public int PageSize { get; set; }
    public int TotalCount { get; set; }
    public int TotalPages { get; set; }

    public bool HasPrevious => CurrentPage > 1;
    public bool HasNext => CurrentPage < TotalPages;
};

public class PaginationHelper
{
    public static async Task<PaginatedResult<T>> CreateAsync<T>(IQueryable<T> query, int page, int pageSize)
    {
        var count = await query.CountAsync();
        var items = await query.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();
        return new PaginatedResult<T>
        {
            Metadata = new PaginationMetaData
            {
                CurrentPage = page,
                PageSize = pageSize,
                TotalCount = count,
                TotalPages = (int)Math.Ceiling(count / (double)pageSize)
            },
            Items = items
        };

    }
}
