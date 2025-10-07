---
title: "Spring Boot JPA 실전 가이드"
date: "2025-10-04"
category: "Framework"
subcategory: "Spring"
tags: ["Spring Boot", "JPA", "Hibernate", "Database"]
excerpt: "Spring Boot와 JPA를 활용하여 효율적인 데이터 접근 계층을 구축하는 방법을 알아봅니다."
author: "Geon Lee"
---

# Spring Boot JPA 실전 가이드

Spring Data JPA는 JPA 기반 데이터 접근 계층을 쉽게 구축할 수 있게 해주는 강력한 도구입니다.

## JPA란?

JPA (Java Persistence API)는 자바 ORM 기술의 표준으로, 객체와 관계형 데이터베이스 간의 매핑을 처리합니다.

## 프로젝트 설정

### build.gradle

```gradle
dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-data-jpa'
    implementation 'org.springframework.boot:spring-boot-starter-web'
    runtimeOnly 'com.h2database:h2'
    // 또는 runtimeOnly 'mysql:mysql-connector-java'
}
```

### application.yml

```yaml
spring:
  datasource:
    url: jdbc:h2:mem:testdb
    driver-class-name: org.h2.Driver
    username: sa
    password:
  jpa:
    hibernate:
      ddl-auto: create
    show-sql: true
    properties:
      hibernate:
        format_sql: true
```

## Entity 정의

```java
@Entity
@Table(name = "users")
@Getter @Setter
@NoArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, length = 50)
    private String name;
    
    @Column(unique = true, nullable = false)
    private String email;
    
    @Column(nullable = false)
    private Integer age;
    
    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
    
    @Builder
    public User(String name, String email, Integer age) {
        this.name = name;
        this.email = email;
        this.age = age;
    }
}
```

## Repository 인터페이스

```java
public interface UserRepository extends JpaRepository<User, Long> {
    // 메소드 이름으로 쿼리 생성
    Optional<User> findByEmail(String email);
    
    List<User> findByAgeBetween(int start, int end);
    
    List<User> findByNameContaining(String keyword);
    
    // @Query 어노테이션 사용
    @Query("SELECT u FROM User u WHERE u.age >= :age")
    List<User> findAdults(@Param("age") int age);
    
    // Native Query
    @Query(value = "SELECT * FROM users WHERE email LIKE %:domain", 
           nativeQuery = true)
    List<User> findByEmailDomain(@Param("domain") String domain);
    
    // Update Query
    @Modifying
    @Query("UPDATE User u SET u.age = :age WHERE u.id = :id")
    int updateAge(@Param("id") Long id, @Param("age") int age);
}
```

## Service 계층

```java
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {
    private final UserRepository userRepository;
    
    @Transactional
    public User createUser(UserCreateRequest request) {
        User user = User.builder()
            .name(request.getName())
            .email(request.getEmail())
            .age(request.getAge())
            .build();
        return userRepository.save(user);
    }
    
    public User getUser(Long id) {
        return userRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("User not found"));
    }
    
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    
    @Transactional
    public User updateUser(Long id, UserUpdateRequest request) {
        User user = getUser(id);
        user.setName(request.getName());
        user.setAge(request.getAge());
        return user; // 더티 체킹으로 자동 업데이트
    }
    
    @Transactional
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}
```

## 연관관계 매핑

### OneToMany / ManyToOne

```java
@Entity
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String title;
    private String content;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
    
    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, 
               orphanRemoval = true)
    private List<Comment> comments = new ArrayList<>();
    
    public void addComment(Comment comment) {
        comments.add(comment);
        comment.setPost(this);
    }
}
```

### ManyToMany

```java
@Entity
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    
    @ManyToMany
    @JoinTable(
        name = "student_course",
        joinColumns = @JoinColumn(name = "student_id"),
        inverseJoinColumns = @JoinColumn(name = "course_id")
    )
    private Set<Course> courses = new HashSet<>();
}
```

## 페이징과 정렬

```java
public interface UserRepository extends JpaRepository<User, Long> {
    Page<User> findByAgeGreaterThan(int age, Pageable pageable);
}

// Service에서 사용
public Page<User> getAdultUsers(int page, int size) {
    Pageable pageable = PageRequest.of(page, size, 
        Sort.by("createdAt").descending());
    return userRepository.findByAgeGreaterThan(18, pageable);
}
```

## QueryDSL 활용

### 설정

```gradle
dependencies {
    implementation 'com.querydsl:querydsl-jpa'
    annotationProcessor 'com.querydsl:querydsl-apt:5.0.0:jpa'
    annotationProcessor 'jakarta.persistence:jakarta.persistence-api'
}
```

### 사용

```java
@Repository
@RequiredArgsConstructor
public class UserRepositoryCustomImpl implements UserRepositoryCustom {
    private final JPAQueryFactory queryFactory;
    
    @Override
    public List<User> findByCondition(UserSearchCondition condition) {
        return queryFactory
            .selectFrom(QUser.user)
            .where(
                nameContains(condition.getName()),
                ageGoe(condition.getMinAge()),
                ageLoe(condition.getMaxAge())
            )
            .orderBy(QUser.user.createdAt.desc())
            .fetch();
    }
    
    private BooleanExpression nameContains(String name) {
        return name != null ? QUser.user.name.contains(name) : null;
    }
    
    private BooleanExpression ageGoe(Integer age) {
        return age != null ? QUser.user.age.goe(age) : null;
    }
    
    private BooleanExpression ageLoe(Integer age) {
        return age != null ? QUser.user.age.loe(age) : null;
    }
}
```

## N+1 문제 해결

### Fetch Join

```java
@Query("SELECT u FROM User u JOIN FETCH u.posts WHERE u.id = :id")
Optional<User> findByIdWithPosts(@Param("id") Long id);
```

### EntityGraph

```java
@EntityGraph(attributePaths = {"posts", "comments"})
@Query("SELECT u FROM User u WHERE u.id = :id")
Optional<User> findByIdWithDetails(@Param("id") Long id);
```

### Batch Size

```yaml
spring:
  jpa:
    properties:
      hibernate:
        default_batch_fetch_size: 100
```

## 성능 최적화 팁

1. **FetchType.LAZY 사용**: 즉시 로딩 피하기
2. **적절한 인덱스**: `@Table(indexes = @Index(...))`
3. **@Transactional(readOnly = true)**: 읽기 전용 최적화
4. **Batch Insert**: `spring.jpa.properties.hibernate.jdbc.batch_size`
5. **DTO 프로젝션**: 필요한 필드만 조회

## 결론

Spring Data JPA는 반복적인 CRUD 작업을 획기적으로 줄여주고, 개발자가 비즈니스 로직에 집중할 수 있게 해줍니다.
적절한 최적화와 함께 사용하면 강력한 데이터 접근 계층을 구축할 수 있습니다! 🚀

