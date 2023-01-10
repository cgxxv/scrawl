package com.example.demo.model;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class Todo {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;
    private String title;
    private String description;
    public Status status;

    public Integer getId() {
        return id;
    }
    public String getTitle() { return title; }
    public Status getStatus() { return status; }
    public String getDescription() { return description; }

    public void setId(Integer id) { this.id = id; }
    public void setTitle(String title) { this.title = title; }
    public void setDescription(String description) { this.description = description; }
    public void setStatus(Status status) { this.status = status; }

    public enum Status {
        Pending(0), Active(1), Completed(2);

        Integer key;

        Status(Integer key) { this.key = key; }

        Status() {}

        static Status getValue(Integer x) {
            if (x == 0) { return Pending; }
            else if (x == 1) { return Active; }
            else if (x == 2) { return Completed; }
            else throw new IllegalArgumentException();
        }
    }
}
