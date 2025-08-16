package dev.felix.spring_todo_backend.controller;

import dev.felix.spring_todo_backend.dto.TaskDTO;
import dev.felix.spring_todo_backend.service.TaskService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/task")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping("/get")
    public ResponseEntity<List<TaskDTO>> getAll() {
        List<TaskDTO> allTasks = taskService.getAll();
        return ResponseEntity.ok(allTasks);
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<?> getByID(@PathVariable Long id) {
        TaskDTO optTask = taskService.getByID(id);

        if (optTask != null) {
            return  ResponseEntity.ok(optTask);
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body("The task with id: " + id + " was not found.");
    }

    @PostMapping("/create")
    public ResponseEntity<TaskDTO> create(@RequestBody TaskDTO taskDTO) {
        TaskDTO createdTask = taskService.create(taskDTO);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(createdTask);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody TaskDTO taskDTO){
        TaskDTO optTask = taskService.getByID(id);

        if (optTask != null) {
            TaskDTO updatedTask = taskService.update(id, taskDTO);
            return ResponseEntity.ok(updatedTask);
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body("The task with id: " + id + " was not found.");
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        TaskDTO optTask = taskService.getByID(id);

        if (optTask != null) {
            taskService.delete(id);
            return ResponseEntity.ok().body("The task with id: " + id + " was successfully deleted.");
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body("The task with id: " + id + " was not found.");
    }

    }
