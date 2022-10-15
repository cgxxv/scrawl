package com.example.demo.controller;

import com.example.demo.model.Greeting;
import jdk.jfr.ContentType;
import org.springframework.web.bind.annotation.*;

import java.util.concurrent.atomic.AtomicLong;

@RestController
public class GreetingController {
    private static final String template = "hello %s!";
    private final AtomicLong counter = new AtomicLong();

    @GetMapping("/greeting")
    public Greeting greeting(@RequestParam(value = "name", defaultValue = "World") String name) {
        return new Greeting(counter.incrementAndGet(), String.format(template, name));
    }

    @RequestMapping(value="/greetings", method = RequestMethod.POST)
    public void addGreeting(@RequestBody Greeting greeting) {
        System.out.println(greeting.getId());
        System.out.println(greeting.getContent());
    }
}
