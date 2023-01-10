package com.example.demo.controller;

import com.example.demo.model.Todo;
import com.example.demo.model.TodoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Controller
@RequestMapping(path = "/todo")
public class TodoController {
    @Autowired
    private TodoRepository todoRepository;

//    @PostMapping(path = "")
//    public @ResponseBody String addTodo(@RequestParam String title, @RequestParam String description) {
//        Todo t = new Todo();
//        t.setTitle(title);
//        t.setDescription(description);
//        t.setStatus(Todo.Status.Pending);
//        todoRepository.save(t);
//        return "OK";
//    }

    @PostMapping("")
    public @ResponseBody Todo addTodo(@RequestBody Todo todo) {
        todo.setStatus(Todo.Status.Pending);
        todoRepository.save(todo);
        return todo;
    }

    @PutMapping("/active")
    public @ResponseBody void activeTodo(@RequestBody List<Integer> ids) {
        System.out.println(Arrays.toString(ids.toArray()));
        Iterable<Todo> ts = todoRepository.findAllById(ids);
        for (Todo t: ts) {
            t.setStatus(Todo.Status.Active);
        }
        todoRepository.saveAll(ts);
    }

    @PutMapping("/completed")
    public @ResponseBody void completedTodo(@RequestBody List<Integer> ids) {
        System.out.println(Arrays.toString(ids.toArray()));
        Iterable<Todo> ts = todoRepository.findAllById(ids);
        for (Todo t: ts) {
            t.setStatus(Todo.Status.Completed);
        }
        todoRepository.saveAll(ts);
    }

    @PutMapping("/update")
    public @ResponseBody void updateTodo(@RequestBody Todo todo) {
        System.out.println(todo.getTitle());
        todoRepository.save(todo);
    }

    @DeleteMapping("/{id}")
    public @ResponseBody void delTodo(@PathVariable(value="id") Integer id) {
        System.out.println(id);
        todoRepository.deleteById(id);
    }

    @GetMapping(path = "")
    public @ResponseBody Iterable<Todo> listTodos() {
        return todoRepository.findAll();
    }
}
