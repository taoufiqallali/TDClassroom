package com.M2I.TDClassroom.controller;

import com.M2I.TDClassroom.dto.DashboardStats;
import com.M2I.TDClassroom.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4201, allowedHeaders = \"*\", allowCredentials = \"true\")")  // Add this for Angular
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/stats")
    public DashboardStats getDashboardStats(@RequestParam(defaultValue = "30") int days) {
        return dashboardService.getDashboardStats(days);
    }
}