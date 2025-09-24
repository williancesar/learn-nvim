using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;

namespace VimPractice.WeekReview;

// Practice file for Day 14: Week Review - Comprehensive C# Application
// This file combines all techniques from Days 8-13
// Practice ALL navigation, editing, and file operations learned this week

/// <summary>
/// Comprehensive E-learning Management System
///
/// WEEK REVIEW PRACTICE GUIDE:
///
/// Day 8 (Undo/Redo): Fix compilation errors with u/Ctrl-r
/// Day 9 (Character Search): Use f/F/t/T to find symbols: (){}[]<>"':;,.*+-=!@#$%^&|
/// Day 10 (Visual Mode): Select classes, methods, blocks with v/V/Ctrl-v
/// Day 11 (Change Operations): Modernize legacy patterns with c/cc/C/s/S
/// Day 12 (Number Operations): Increment/decrement with Ctrl-a/Ctrl-x
/// Day 13 (File Operations): Navigate between multiple files with :e/:sp/:vs/:tabnew
///
/// COMPREHENSIVE PRACTICE WORKFLOW:
/// 1. Start with this file (practice.cs)
/// 2. Find and fix compilation errors (Day 8 skills)
/// 3. Navigate using character search (Day 9 skills)
/// 4. Select and modify code blocks (Day 10 skills)
/// 5. Modernize legacy patterns (Day 11 skills)
/// 6. Adjust numeric values (Day 12 skills)
/// 7. Open and work across multiple related files (Day 13 skills)
/// </summary>

// INTENTIONAL COMPILATION ERRORS FOR DAY 8 PRACTICE
// Fix these errors using undo/redo operations

[ApiController]
[Route("api/[controller]")]
public class CourseController : ControllerBase
{
    private readonly ILogger<CourseController> _logger;
    private readonly ELearningContext _context;
    private readonly IMemoryCache _cache;
    private readonly ICourseService _courseService;

    // Error 1: Missing semicolon
    public CourseController(
        ILogger<CourseController> logger,
        ELearningContext context,
        IMemoryCache cache,
        ICourseService courseService)
    {
        _logger = logger
        _context = context ?? throw new ArgumentNullException(nameof(context));
        _cache = cache ?? throw new ArgumentNullException(nameof(cache));
        _courseService = courseService ?? throw new ArgumentNullException(nameof(courseService));
    }

    // Error 2: Missing async keyword
    [HttpGet]
    public Task<ActionResult<List<CourseDto>>> GetCoursesAsync(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? category = null,
        [FromQuery] string? difficulty = null,
        [FromQuery] decimal? minPrice = null,
        [FromQuery] decimal maxPrice = null) // Error 3: Should be nullable
    {
        try
        {
            // CHARACTER SEARCH PRACTICE (Day 9)
            // Practice finding these symbols with f/F/t/T:
            // Parentheses: ( )  Brackets: [ ]  Braces: { }  Angles: < >
            // Quotes: " '  Operators: = + - * / % & | ^ ~ ! < > <= >= == != && ||
            // Special: @ # $ % ^ & * ! ~ ` ? : ; , .

            var cacheKey = $"courses:{page}:{pageSize}:{category}:{difficulty}:{minPrice}:{maxPrice}";

            if (_cache.TryGetValue(cacheKey, out List<CourseDto> cachedCourses))
            {
                _logger.LogDebug("Retrieved {Count} courses from cache", cachedCourses.Count);
                return Ok(cachedCourses);
            }

            var query = _context.Courses
                .Include(c => c.Category)
                .Include(c => c.Instructor)
                .Include(c => c.Enrollments)
                .Include(c => c.Reviews)
                .Where(c => c.IsActive);

            // VISUAL MODE PRACTICE (Day 10)
            // Select these filter blocks with V (line mode) or v (character mode)
            if (!string.IsNullOrEmpty(category))
            {
                query = query.Where(c => c.Category.Name.ToLower().Contains(category.ToLower()));
            }

            if (!string.IsNullOrEmpty(difficulty))
            {
                query = query.Where(c => c.Difficulty.ToString().ToLower() == difficulty.ToLower());
            }

            if (minPrice.HasValue)
            {
                query = query.Where(c => c.Price >= minPrice.Value);
            }

            if (maxPrice.HasValue)
            {
                query = query.Where(c => c.Price <= maxPrice.Value);
            }

            // NUMBER OPERATIONS PRACTICE (Day 12)
            // Practice incrementing/decrementing these numeric values with Ctrl-a/Ctrl-x
            const int defaultCacheMinutes = 15;
            const int maxCoursesPerPage = 100;
            const int defaultRatingThreshold = 4;
            const decimal discountPercentage = 0.15m;

            var totalCount = await query.CountAsync();
            var courses = await query
                .OrderByDescending(c => c.CreatedAt)
                .Skip((page - 1) * Math.Min(pageSize, maxCoursesPerPage))
                .Take(Math.Min(pageSize, maxCoursesPerPage))
                .Select(c => new CourseDto
                {
                    Id = c.Id,
                    Title = c.Title,
                    Description = c.Description,
                    Price = c.Price,
                    Duration = c.DurationMinutes,
                    Difficulty = c.Difficulty.ToString(),
                    CategoryName = c.Category.Name,
                    InstructorName = $"{c.Instructor.FirstName} {c.Instructor.LastName}",
                    EnrollmentCount = c.Enrollments.Count(e => e.IsActive),
                    AverageRating = c.Reviews.Any() ? c.Reviews.Average(r => r.Rating) : 0,
                    ReviewCount = c.Reviews.Count,
                    ThumbnailUrl = c.ThumbnailUrl,
                    IsPublished = c.IsPublished,
                    CreatedAt = c.CreatedAt
                })
                .ToListAsync();

            var cacheOptions = new MemoryCacheEntryOptions()
                .SetSlidingExpiration(TimeSpan.FromMinutes(defaultCacheMinutes))
                .SetAbsoluteExpiration(TimeSpan.FromHours(1))
                .SetSize(courses.Count);

            _cache.Set(cacheKey, courses, cacheOptions);

            _logger.LogInformation("Retrieved {Count} of {Total} courses for page {Page}",
                courses.Count, totalCount, page);

            return Ok(new
            {
                Data = courses,
                TotalCount = totalCount,
                Page = page,
                PageSize = pageSize,
                TotalPages = (int)Math.Ceiling((double)totalCount / pageSize)
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving courses");
            return StatusCode(500, "An error occurred while retrieving courses");
        }
    }

    // Error 4: Wrong return type (should be Task<ActionResult<CourseDetailDto>>)
    [HttpGet("{id:int}")]
    public async CourseDetailDto GetCourseByIdAsync(int id)
    {
        try
        {
            var cacheKey = $"course_detail:{id}";

            if (_cache.TryGetValue(cacheKey, out CourseDetailDto cachedCourse))
            {
                return cachedCourse;
            }

            var course = await _context.Courses
                .Include(c => c.Category)
                .Include(c => c.Instructor)
                .Include(c => c.Modules.OrderBy(m => m.SortOrder))
                .ThenInclude(m => m.Lessons.OrderBy(l => l.SortOrder))
                .Include(c => c.Enrollments)
                .Include(c => c.Reviews.OrderByDescending(r => r.CreatedAt))
                .ThenInclude(r => r.Student)
                .FirstOrDefaultAsync(c => c.Id == id && c.IsActive);

            if (course == null)
            {
                return NotFound($"Course with ID {id} not found");
            }

            // CHANGE OPERATIONS PRACTICE (Day 11)
            // Modernize this legacy code to use modern C# patterns
            // Change string concatenation to string interpolation
            // Change manual null checks to null operators
            // Change foreach loops to LINQ where appropriate

            var courseDetail = new CourseDetailDto
            {
                Id = course.Id,
                Title = course.Title,
                Description = course.Description,
                LongDescription = course.LongDescription,
                Price = course.Price,
                OriginalPrice = course.OriginalPrice,
                Duration = course.DurationMinutes,
                Difficulty = course.Difficulty.ToString(),
                Language = course.Language,
                CategoryName = course.Category.Name,
                InstructorName = course.Instructor.FirstName + " " + course.Instructor.LastName, // Modernize this
                InstructorBio = course.Instructor.Bio,
                InstructorImageUrl = course.Instructor.ProfileImageUrl,
                ThumbnailUrl = course.ThumbnailUrl,
                PreviewVideoUrl = course.PreviewVideoUrl,
                IsPublished = course.IsPublished,
                CreatedAt = course.CreatedAt,
                UpdatedAt = course.UpdatedAt,

                // Legacy collection handling - modernize to LINQ
                Modules = new List<ModuleDto>(),
                Reviews = new List<ReviewDto>(),
                Prerequisites = new List<string>(),
                LearningObjectives = new List<string>(),

                // Legacy calculations - modernize
                EnrollmentCount = 0,
                AverageRating = 0,
                ReviewCount = 0,
                CompletionRate = 0
            };

            // Legacy foreach loop - change to LINQ
            foreach (var module in course.Modules)
            {
                var moduleDto = new ModuleDto
                {
                    Id = module.Id,
                    Title = module.Title,
                    Description = module.Description,
                    SortOrder = module.SortOrder,
                    Lessons = new List<LessonDto>()
                };

                foreach (var lesson in module.Lessons)
                {
                    var lessonDto = new LessonDto
                    {
                        Id = lesson.Id,
                        Title = lesson.Title,
                        Description = lesson.Description,
                        DurationMinutes = lesson.DurationMinutes,
                        SortOrder = lesson.SortOrder,
                        VideoUrl = lesson.VideoUrl,
                        ContentType = lesson.ContentType.ToString(),
                        IsPreview = lesson.IsPreview
                    };

                    moduleDto.Lessons.Add(lessonDto);
                }

                courseDetail.Modules.Add(moduleDto);
            }

            // Legacy null checking - modernize with null operators
            if (course.Reviews != null)
            {
                courseDetail.ReviewCount = course.Reviews.Count();
                if (course.Reviews.Count() > 0)
                {
                    courseDetail.AverageRating = course.Reviews.Average(r => r.Rating);
                }
            }

            if (course.Enrollments != null)
            {
                courseDetail.EnrollmentCount = course.Enrollments.Count(e => e.IsActive);

                var completedEnrollments = 0;
                foreach (var enrollment in course.Enrollments)
                {
                    if (enrollment.CompletedAt != null)
                    {
                        completedEnrollments++;
                    }
                }

                if (courseDetail.EnrollmentCount > 0)
                {
                    courseDetail.CompletionRate = (double)completedEnrollments / courseDetail.EnrollmentCount * 100;
                }
            }

            var cacheOptions = new MemoryCacheEntryOptions()
                .SetSlidingExpiration(TimeSpan.FromMinutes(30))
                .SetSize(1);

            _cache.Set(cacheKey, courseDetail, cacheOptions);

            return courseDetail;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving course {CourseId}", id);
            throw;
        }
    }

    // Error 5: Missing closing brace
    [HttpPost]
    [Authorize(Roles = "Instructor,Admin")]
    public async Task<ActionResult<CourseDto>> CreateCourseAsync([FromBody] CreateCourseRequest request)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var course = new Course
            {
                Title = request.Title,
                Description = request.Description,
                LongDescription = request.LongDescription,
                Price = request.Price,
                OriginalPrice = request.OriginalPrice,
                DurationMinutes = request.DurationMinutes,
                Difficulty = request.Difficulty,
                Language = request.Language,
                CategoryId = request.CategoryId,
                InstructorId = request.InstructorId,
                ThumbnailUrl = request.ThumbnailUrl,
                PreviewVideoUrl = request.PreviewVideoUrl,
                IsActive = true,
                IsPublished = false,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Courses.Add(course);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Created course {CourseId} with title {Title}",
                course.Id, course.Title);

            var courseDto = await _courseService.GetCourseDtoAsync(course.Id);
            return CreatedAtAction(nameof(GetCourseByIdAsync), new { id = course.Id }, courseDto);


        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating course");
            return StatusCode(500, "An error occurred while creating the course");
        }
    }
}

// LEGACY DATA MODELS FOR CHANGE OPERATIONS PRACTICE (Day 11)
// Modernize these to use records, properties, and modern patterns

// Error 6: Should be public record
class CourseDto
{
    // Error 7: Should use properties with { get; init; }
    public int Id;
    public string Title;
    public string Description;
    public decimal Price;
    public int Duration;
    public string Difficulty;
    public string CategoryName;
    public string InstructorName;
    public int EnrollmentCount;
    public double AverageRating;
    public int ReviewCount;
    public string ThumbnailUrl;
    public bool IsPublished;
    public DateTime CreatedAt;
}

// Legacy class - change to modern record
public class CourseDetailDto
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public string LongDescription { get; set; }
    public decimal Price { get; set; }
    public decimal OriginalPrice { get; set; }
    public int Duration { get; set; }
    public string Difficulty { get; set; }
    public string Language { get; set; }
    public string CategoryName { get; set; }
    public string InstructorName { get; set; }
    public string InstructorBio { get; set; }
    public string InstructorImageUrl { get; set; }
    public string ThumbnailUrl { get; set; }
    public string PreviewVideoUrl { get; set; }
    public bool IsPublished { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public List<ModuleDto> Modules { get; set; }
    public List<ReviewDto> Reviews { get; set; }
    public List<string> Prerequisites { get; set; }
    public List<string> LearningObjectives { get; set; }
    public int EnrollmentCount { get; set; }
    public double AverageRating { get; set; }
    public int ReviewCount { get; set; }
    public double CompletionRate { get; set; }
}

// More legacy patterns to modernize
public class CreateCourseRequest
{
    [Required]
    [StringLength(200)]
    public string Title { get; set; }

    [Required]
    [StringLength(1000)]
    public string Description { get; set; }

    [StringLength(5000)]
    public string LongDescription { get; set; }

    [Required]
    [Range(0.01, 9999.99)]
    public decimal Price { get; set; }

    [Range(0.01, 9999.99)]
    public decimal OriginalPrice { get; set; }

    [Required]
    [Range(1, 10000)]
    public int DurationMinutes { get; set; }

    [Required]
    public CourseDifficulty Difficulty { get; set; }

    [Required]
    [StringLength(10)]
    public string Language { get; set; }

    [Required]
    public int CategoryId { get; set; }

    [Required]
    public int InstructorId { get; set; }

    [Url]
    public string ThumbnailUrl { get; set; }

    [Url]
    public string PreviewVideoUrl { get; set; }
}

// Entity models with numeric values for Day 12 practice
public class Course
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public string LongDescription { get; set; }
    public decimal Price { get; set; }
    public decimal OriginalPrice { get; set; }
    public int DurationMinutes { get; set; }
    public CourseDifficulty Difficulty { get; set; }
    public string Language { get; set; } = "en";
    public int CategoryId { get; set; }
    public Category Category { get; set; }
    public int InstructorId { get; set; }
    public Instructor Instructor { get; set; }
    public string ThumbnailUrl { get; set; }
    public string PreviewVideoUrl { get; set; }
    public bool IsActive { get; set; } = true;
    public bool IsPublished { get; set; } = false;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    // Navigation properties
    public ICollection<Module> Modules { get; set; } = new List<Module>();
    public ICollection<Enrollment> Enrollments { get; set; } = new List<Enrollment>();
    public ICollection<Review> Reviews { get; set; } = new List<Review>();
}

// Practice incrementing these numeric values (Day 12)
public class Module
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public int SortOrder { get; set; }
    public int CourseId { get; set; }
    public Course Course { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public ICollection<Lesson> Lessons { get; set; } = new List<Lesson>();
}

public class Lesson
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public int DurationMinutes { get; set; }
    public int SortOrder { get; set; }
    public string VideoUrl { get; set; }
    public ContentType ContentType { get; set; }
    public bool IsPreview { get; set; } = false;
    public int ModuleId { get; set; }
    public Module Module { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

// Additional entities with numeric constants for practice
public class Category
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public string Slug { get; set; }
    public int SortOrder { get; set; } = 0;
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; }

    public ICollection<Course> Courses { get; set; } = new List<Course>();
}

public class Instructor
{
    public int Id { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
    public string Bio { get; set; }
    public string ProfileImageUrl { get; set; }
    public int YearsExperience { get; set; } = 0;
    public decimal HourlyRate { get; set; } = 50.00m;
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; }

    public ICollection<Course> Courses { get; set; } = new List<Course>();
}

public class Student
{
    public int Id { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
    public DateTime DateOfBirth { get; set; }
    public string ProfileImageUrl { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; }

    public ICollection<Enrollment> Enrollments { get; set; } = new List<Enrollment>();
    public ICollection<Review> Reviews { get; set; } = new List<Review>();
}

public class Enrollment
{
    public int Id { get; set; }
    public int CourseId { get; set; }
    public Course Course { get; set; }
    public int StudentId { get; set; }
    public Student Student { get; set; }
    public DateTime EnrolledAt { get; set; }
    public DateTime? CompletedAt { get; set; }
    public int ProgressPercentage { get; set; } = 0;
    public bool IsActive { get; set; } = true;
    public decimal AmountPaid { get; set; }
}

public class Review
{
    public int Id { get; set; }
    public int CourseId { get; set; }
    public Course Course { get; set; }
    public int StudentId { get; set; }
    public Student Student { get; set; }
    public int Rating { get; set; } // 1-5 stars
    public string Title { get; set; }
    public string Comment { get; set; }
    public bool IsApproved { get; set; } = true;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

// DTOs for data transfer
public record ModuleDto(
    int Id,
    string Title,
    string Description,
    int SortOrder,
    List<LessonDto> Lessons);

public record LessonDto(
    int Id,
    string Title,
    string Description,
    int DurationMinutes,
    int SortOrder,
    string VideoUrl,
    string ContentType,
    bool IsPreview);

public record ReviewDto(
    int Id,
    int Rating,
    string Title,
    string Comment,
    string StudentName,
    DateTime CreatedAt);

// Enums
public enum CourseDifficulty
{
    Beginner = 1,
    Intermediate = 2,
    Advanced = 3,
    Expert = 4
}

public enum ContentType
{
    Video = 1,
    Article = 2,
    Quiz = 3,
    Assignment = 4,
    Download = 5
}

// Database context
public class ELearningContext : DbContext
{
    public ELearningContext(DbContextOptions<ELearningContext> options) : base(options) { }

    public DbSet<Course> Courses { get; set; }
    public DbSet<Module> Modules { get; set; }
    public DbSet<Lesson> Lessons { get; set; }
    public DbSet<Category> Categories { get; set; }
    public DbSet<Instructor> Instructors { get; set; }
    public DbSet<Student> Students { get; set; }
    public DbSet<Enrollment> Enrollments { get; set; }
    public DbSet<Review> Reviews { get; set; }
}

// Service interface
public interface ICourseService
{
    Task<CourseDto> GetCourseDtoAsync(int courseId);
    Task<List<CourseDto>> SearchCoursesAsync(string searchTerm);
    Task<bool> PublishCourseAsync(int courseId);
}

/*
COMPREHENSIVE WEEK REVIEW PRACTICE INSTRUCTIONS:

1. DAY 8 - UNDO/REDO PRACTICE:
   - Fix compilation errors throughout this file
   - Practice using 'u' to undo changes
   - Practice using Ctrl-r to redo changes
   - Build muscle memory for error correction cycles

2. DAY 9 - CHARACTER SEARCH PRACTICE:
   - Use f/F/t/T to find these symbols:
   - Parentheses: ( )
   - Brackets: [ ]
   - Braces: { }
   - Angle brackets: < >
   - Quotes: " '
   - Operators: = + - * / % & | ^ ~ ! < > <= >= == != && ||
   - Special characters: @ # $ % ^ & * ! ~ ` ? : ; , .
   - Practice ; and , to repeat searches

3. DAY 10 - VISUAL MODE PRACTICE:
   - Select entire methods with V
   - Select class definitions with V + motion
   - Select method parameters with vi( or va(
   - Select property blocks with visual mode
   - Use gv to reselect previous selections

4. DAY 11 - CHANGE OPERATIONS PRACTICE:
   - Change legacy classes to modern records
   - Change public fields to properties
   - Change string concatenation to interpolation
   - Change manual loops to LINQ expressions
   - Change manual null checks to null operators
   - Use c{motion}, cc, C, s, S, r, R effectively

5. DAY 12 - NUMBER OPERATIONS PRACTICE:
   - Increment/decrement numeric constants with Ctrl-a/Ctrl-x
   - Practice on: IDs, durations, ratings, prices, percentages
   - Use [number]Ctrl-a to increment by specific amounts
   - Practice on version numbers and numeric arrays

6. DAY 13 - FILE OPERATIONS PRACTICE:
   - This file represents the main application file
   - Practice creating and opening related files:
     * :e Models.cs (create data models)
     * :sp Services.cs (create service layer)
     * :vs Controllers.cs (create additional controllers)
     * :tabnew Configuration.cs (create config file)
   - Navigate between files using Ctrl-w commands
   - Practice :wa to save all files
   - Practice :qa to close all files

7. COMBINED PRACTICE WORKFLOW:
   - Start by fixing compilation errors (Day 8)
   - Navigate to specific locations using character search (Day 9)
   - Select code blocks for modification (Day 10)
   - Modernize legacy patterns (Day 11)
   - Adjust numeric values as needed (Day 12)
   - Work across multiple related files (Day 13)

MASTER ALL TECHNIQUES FROM DAYS 8-13 IN ONE COMPREHENSIVE EXERCISE!
*/