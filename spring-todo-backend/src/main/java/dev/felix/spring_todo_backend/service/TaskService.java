package dev.felix.spring_todo_backend.service;

import dev.felix.spring_todo_backend.entity.Task;
import dev.felix.spring_todo_backend.repository.TaskRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TaskService {

    private final TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    public List<Task> getAll() {
        return taskRepository.findAll();
    }

    public Task getByID(Long id) {
        Optional<Task> optTask = taskRepository.findById(id);
        return optTask.orElse(null);
    }

    public Task create(Task task){
        return taskRepository.save(task);
    }

    public Task update(Long id, Task task) {
        task.setId(id);
        taskRepository.save(task);
        return task;
    }

    public void delete(Long id) {
        taskRepository.deleteById(id);
    }

}
