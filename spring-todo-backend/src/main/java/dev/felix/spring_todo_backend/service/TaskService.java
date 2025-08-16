package dev.felix.spring_todo_backend.service;

import dev.felix.spring_todo_backend.dto.TaskDTO;
import dev.felix.spring_todo_backend.entity.Task;
import dev.felix.spring_todo_backend.mapper.TaskMapper;
import dev.felix.spring_todo_backend.repository.TaskRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final TaskMapper taskMapper;

    public TaskService(TaskRepository taskRepository, TaskMapper taskMapper) {
        this.taskRepository = taskRepository;
        this.taskMapper = taskMapper;
    }

    public List<TaskDTO> getAll() {
        List<Task> taskList = taskRepository.findAll();

        return taskList.stream()
                .map(taskMapper::map)
                .collect(Collectors.toList());
    }

    public TaskDTO getByID(Long id) {
        Optional<Task> optTask = taskRepository.findById(id);
        return optTask.map(taskMapper::map).orElse(null);
    }

    public TaskDTO create(TaskDTO taskDTO){
        Task task = taskMapper.map(taskDTO);
        taskRepository.save(task);
        return taskMapper.map(task);
    }

    public TaskDTO update(Long id, TaskDTO taskDTO) {
        Task task = taskMapper.map(taskDTO);
        task.setId(id);
        taskRepository.save(task);
        return taskMapper.map(task);
    }

    public void delete(Long id) {
        taskRepository.deleteById(id);
    }

}
