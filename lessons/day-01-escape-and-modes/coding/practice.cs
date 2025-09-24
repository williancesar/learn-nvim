/*
 * Day 01: Escape & Modes Practice
 *
 * Practice Instructions:
 * 1. Use 'i' to enter INSERT mode and add your name after "Developer:"
 * 2. Press <Esc> to return to NORMAL mode
 * 3. Navigate between regions using 'j' and 'k'
 * 4. Practice entering VISUAL mode with 'v' to select text
 * 5. Use ':' to enter COMMAND mode
 * 6. Find TODO markers and practice mode switching
 */

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NvimPractice.Day01;

#region Developer Information
// TODO: Add your name here
// Developer:
// Date: 2025-09-23
// Practice Focus: Vim Modes (Normal, Insert, Visual, Command)
#endregion

#region Core Classes
/// <summary>
/// A modern C# record representing a task in our learning system
/// </summary>
public record LearningTask(
    int Id,
    string Title,
    TaskStatus Status,
    DateTime? DueDate = null,
    string? Description = null
)
{
    // TODO: Add a method to mark task as completed
    public LearningTask MarkCompleted() => this with { Status = TaskStatus.Completed };

    // TODO: Add validation for title length
    public bool IsValid => !string.IsNullOrWhiteSpace(Title) && Title.Length > 3;
}

public enum TaskStatus
{
    Pending,
    InProgress,
    Completed,
    Cancelled
}
#endregion

#region Service Layer
public class TaskManager
{
    private readonly List<LearningTask> _tasks = new();

    // TODO: Implement add task functionality
    public void AddTask(LearningTask task)
    {
        if (task.IsValid)
        {
            _tasks.Add(task);
        }
        // TODO: Add error handling for invalid tasks
    }

    // TODO: Implement task filtering by status
    public IEnumerable<LearningTask> GetTasksByStatus(TaskStatus status)
    {
        return _tasks.Where(t => t.Status == status);
    }

    // TODO: Add method to get overdue tasks
    public IEnumerable<LearningTask> GetOverdueTasks()
    {
        var today = DateTime.Today;
        return _tasks.Where(t => t.DueDate.HasValue && t.DueDate.Value < today);
    }
}
#endregion

#region Practice Exercises
public static class ModeExercises
{
    // TODO: Practice switching to INSERT mode here and add comments

    public static void ExerciseOne()
    {
        // NORMAL mode: Navigate here with 'j' and 'k'
        Console.WriteLine("Welcome to Neovim practice!");

        // TODO: Enter INSERT mode and add a welcome message
    }

    public static void ExerciseTwo()
    {
        // VISUAL mode: Select this entire method with 'V'
        var numbers = Enumerable.Range(1, 10).ToList();

        // TODO: Use VISUAL mode to select and copy this line
        var squares = numbers.Select(n => n * n).ToArray();

        Console.WriteLine($"Squares: {string.Join(", ", squares)}");
    }

    // TODO: Add ExerciseThree method for COMMAND mode practice
}
#endregion

#region Advanced Features
public class AsyncTaskProcessor
{
    // TODO: Navigate to this method and practice mode switching
    public async Task<string> ProcessTaskAsync(LearningTask task)
    {
        // NORMAL mode: Use 'f' to find characters in this line
        await Task.Delay(100); // Simulate processing time

        return task.Status switch
        {
            TaskStatus.Pending => "Task is waiting to be started",
            TaskStatus.InProgress => "Task is currently being processed",
            TaskStatus.Completed => "Task has been finished successfully",
            TaskStatus.Cancelled => "Task was cancelled before completion",
            _ => "Unknown task status"
        };
    }
}
#endregion

#region Main Entry Point
public class Program
{
    public static async Task Main(string[] args)
    {
        // TODO: Practice entering INSERT mode to modify this method
        var taskManager = new TaskManager();
        var processor = new AsyncTaskProcessor();

        // Sample tasks for practice
        var sampleTasks = new[]
        {
            new LearningTask(1, "Learn Vim basics", TaskStatus.InProgress),
            new LearningTask(2, "Master text navigation", TaskStatus.Pending, DateTime.Today.AddDays(7)),
            new LearningTask(3, "Practice editing commands", TaskStatus.Pending)
        };

        // TODO: Use VISUAL mode to select and examine this foreach loop
        foreach (var task in sampleTasks)
        {
            taskManager.AddTask(task);
            var result = await processor.ProcessTaskAsync(task);
            Console.WriteLine($"Task {task.Id}: {result}");
        }

        // TODO: Navigate to this line and practice switching modes
        Console.WriteLine("Neovim practice session completed!");
    }
}
#endregion