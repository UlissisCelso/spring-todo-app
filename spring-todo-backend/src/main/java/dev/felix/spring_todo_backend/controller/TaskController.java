package dev.felix.spring_todo_backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/task")
public class TaskController {


    @GetMapping("/greetings")
    public String greetings() {
        return "Hello, this is my springboot app!";
    }

}
