package dev.felix.spring_todo_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class TaskDTO {

    private Long id;

    private String title;

    private String description;

    private Boolean completed = false;

    private LocalDateTime createdAt;

    private  LocalDateTime updatedAt;

}
