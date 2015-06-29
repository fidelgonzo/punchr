package com.punchr.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.punchr.domain.util.CustomDateTimeDeserializer;
import com.punchr.domain.util.CustomDateTimeSerializer;
import org.hibernate.annotations.Type;
import org.joda.time.DateTime;

import javax.persistence.*;
import javax.validation.constraints.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

/**
 * A Timesheet.
 */
@Entity
@Table(name = "T_TIMESHEET")
public class Timesheet implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @NotNull
    @Type(type = "org.jadira.usertype.dateandtime.joda.PersistentDateTime")
    @JsonSerialize(using = CustomDateTimeSerializer.class)
    @JsonDeserialize(using = CustomDateTimeDeserializer.class)
    @Column(name = "date", nullable = false)
    private DateTime date;

    @NotNull
    @Size(min = 3)
    @Column(name = "title", nullable = false)
    private String title;

    @NotNull
    @Type(type = "org.jadira.usertype.dateandtime.joda.PersistentDateTime")
    @JsonSerialize(using = CustomDateTimeSerializer.class)
    @JsonDeserialize(using = CustomDateTimeDeserializer.class)
    @Column(name = "duration", nullable = false)
    private DateTime duration;
    
    @NotNull
    @Column(name = "distance", precision=10, scale=3, nullable = false)
    private BigDecimal distance;

    @Type(type = "org.jadira.usertype.dateandtime.joda.PersistentDateTime")
    @JsonSerialize(using = CustomDateTimeSerializer.class)
    @JsonDeserialize(using = CustomDateTimeDeserializer.class)
    @Column(name = "created", nullable = false)
    private DateTime created;

    @ManyToOne
    private User userId;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public DateTime getDate() {
        return date;
    }

    public void setDate(DateTime date) {
        this.date = date;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public DateTime getDuration() {
        return duration;
    }

    public void setDuration(DateTime duration) {
        this.duration = duration;
    }

    public DateTime getCreated() {
        return created;
    }

    public void setCreated(DateTime created) {
        this.created = created;
    }

    public User getUserId() {
        return userId;
    }

    public void setUserId(User user) {
        this.userId = user;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }

        Timesheet timesheet = (Timesheet) o;

        if ( ! Objects.equals(id, timesheet.id)) return false;

        return true;
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public String toString() {
        return "Timesheet{" +
                "id=" + id +
                ", date='" + date + "'" +
                ", title='" + title + "'" +
                ", duration='" + duration + "'" +
                ", distance='" + getDistance() + "'" +
                ", created='" + created + "'" +
                '}';
    }

	public BigDecimal getDistance() {
		return distance;
	}

	public void setDistance(BigDecimal distance) {
		this.distance = distance;
	}
}
