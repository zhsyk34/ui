package com.cat.entity;

import lombok.*;
import lombok.experimental.Accessors;

import java.time.LocalDateTime;

@Getter
@Setter
@Accessors(chain = true)
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Lock {
	private Long id;
	private Long gatewayId;
	private int number;
	private String uuid;
	private String name;
	private boolean permission = false;
	private LocalDateTime createTime = LocalDateTime.now();
	private LocalDateTime updateTime = LocalDateTime.now();
}
