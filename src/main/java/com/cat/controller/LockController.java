package com.cat.controller;

import com.cat.entity.Lock;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.ArrayList;
import java.util.List;

@Controller
@RequestMapping("/lock")
public class LockController {

	@RequestMapping("/find")
	@ResponseBody
	public List<Lock> find() {
		List<Lock> list = new ArrayList<>();
		for (long i = 1; i < 5; i++) {
			Lock lock = new Lock().setId(i).setGatewayId(2 * i).setName("name" + i).setNumber((int) (3 * i)).setPermission(i % 2 == 0);
			list.add(lock);
		}
		return list;
	}
}
