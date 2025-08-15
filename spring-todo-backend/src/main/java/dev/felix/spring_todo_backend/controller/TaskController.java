package dev.felix.spring_todo_backend.controller;

import dev.felix.spring_todo_backend.entity.Task;
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

    @GetMapping("/greetings")
    public String greetings() {
        return "Hello, this is my springboot app!";
    }

    /*
    * Implement CRUD functions
    * -GET
    * -GET BY ID
    * -POST
    * -PUT
    * -DELETE
    * */

    @GetMapping("/get")
    public ResponseEntity<List<Task>> getAll() {
        List<Task> allTasks = taskService.getAll();
        return ResponseEntity.ok(allTasks);
    }


    @GetMapping("/get/{id}")
    public ResponseEntity<?> getByID(@PathVariable Long id) {
        Task optTask = taskService.getByID(id);

        if (optTask != null) {
            return  ResponseEntity.ok(optTask);
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body("The task with id: " + id + " was not found.");
    }

    @PostMapping("/create")
    public ResponseEntity<Task> create(@RequestBody Task task) {
        Task createdTask = taskService.create(task);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(task);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Task task){
        Task optTask = taskService.getByID(id);

        if (optTask != null) {
            Task updatedTask = taskService.update(id, task);
            return ResponseEntity.ok(updatedTask);
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body("The task with id: " + id + " was not found.");
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        Task optTask = taskService.getByID(id);

        if (optTask != null) {
            taskService.delete(id);
            return ResponseEntity.ok().body("The task with id: " + id + " was successfully deleted.");
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body("The task with id: " + id + " was not found.");
    }

    }
