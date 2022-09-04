package com.example.demo.controller;

import com.example.demo.model.Todo;
import com.example.demo.model.TodoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping(path = "/todo")
public class TodoController {
    @Autowired
    private TodoRepository todoRepository;

    @PostMapping(path = "")
    public @ResponseBody String addTodo(@RequestParam String title, @RequestParam String description) {
        Todo t = new Todo();
        t.setTitle(title);
        t.setDescription(description);
        todoRepository.save(t);
        return "OK";
    }

    @GetMapping(path = "")
    public @ResponseBody Iterable<Todo> listTodos() {
        return todoRepository.findAll();
    }
}
