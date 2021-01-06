
var MutationRate = 0.5;
class Vehicle
{
    constructor(x,y,dna)
    {
        this.position = new Vector(x,y);
        this.velocity = new Vector(Math.random()*8-4,Math.random()*8-4);
        this.acceleration = new Vector(0,0);
        this.r = 6;
        this.maxForce = 0.05;
        this.maxSpeed = 3.0;

        this.health = 1;

        this.dna = [];

        if (dna == undefined)
        {
            //Attraction to food
            this.dna[0] = Math.random() * 4- 2;
            //Attraction to poison
            this.dna[1] = Math.random() * 4 - 2;
            //Food perception
            this.dna[2] = Math.random() * 100;
            //Poison perception
            this.dna[3] = Math.random() * 100;
        }
        else
        {
            this.dna[0] = dna[0];
            if (Math.random() < MUTATIONRATE)
            {
                this.dna[0] += Math.random()*2 - 1;
            }
            this.dna[1] = dna[1];
            if (Math.random() < MUTATIONRATE)
            {
                this.dna[1] += Math.random()*2 - 1;
            }
            this.dna[2] = dna[2];
            if (Math.random() < MUTATIONRATE)
            {
                this.dna[2] += Math.random()*60-30;
                if (this.dna[2] < 0)
                {
                    this.dna[2] = 0;
                }
            }
            this.dna[3] = dna[3];
            if (Math.random() < MUTATIONRATE)
            {
                this.dna[3] += Math.random()*60-30;
                if (this.dna[3] < 0)
                {
                    this.dna[3] = 0;
                }
            }
        }
    }

    Update()
    {
        this.health -= 0.003;
        this.velocity = Vector.Add(this.velocity,this.acceleration);
        this.velocity = Vector.Limit(this.velocity,this.maxSpeed);
        this.position = Vector.Add(this.position,this.velocity);
        this.acceleration = new Vector(0,0);
    }

    Behave(good, bad)
    {
        var steerG = this.Eat(good,FOODREWARD,this.dna[2]);
        var steerB = this.Eat(bad,POISONPUNISHMENT,this.dna[3]);

        steerG = Vector.Scale(steerG, this.dna[0]);
        steerB = Vector.Scale(steerB, this.dna[1]);

        this.ApplyForce(steerG);
        this.ApplyForce(steerB);
    }

    ApplyForce(force)
    {
        // Assume mass to be 1
        this.acceleration = Vector.Add(this.acceleration,force);
    }

    Eat(list,nutrition,perception)
    {
        var record = Infinity;
        var closest = null;
        for(var i = list.length - 1; i >= 0; i--)
        {
            var d = Vector.DistanceSquared(list[i],this.position);
            
            if (d <= 6 * this.maxSpeed * this.maxSpeed)
            {
                list.splice(i,1);
                this.health += nutrition;
                if (this.health > 1)
                {
                    this.health = 1;
                }
            }
            else if (d < record && d < perception * perception)
            {
                record = d;
                closest = list[i];
            }
        }
        
        if (closest != null)
        {
            return this.Seek(closest);
        }

        return new Vector(0,0);
    }

    Seek(target)
    {
        let desired = Vector.Subtract(target,this.position);
        desired = Vector.SetLength(desired,this.maxSpeed);
        let steer = Vector.Subtract(desired,this.velocity);
        steer = Vector.Limit(steer,this.maxForce);
        return steer;
    }

    Dead = function()
    {
        return this.health < 0;
    }

    Reproduce()
    {
        if (Math.random() < REPRODUCTIONRATE)
        {
            return new Vehicle(this.position.x,this.position.y,this.dna)
        }
        return null;
    }

    Draw(ctx)
    {
        var theta = Vector.GetAngle(this.velocity);

        let point1 = new Vector(this.r*2,0);
        let point2 = new Vector(-this.r*2,-this.r);
        let point3 = new Vector(-this.r*2,this.r);

        point1 = Vector.Rotate(point1,theta);
        point2 = Vector.Rotate(point2,theta);
        point3 = Vector.Rotate(point3,theta);

        point1 = Vector.Add(point1,this.position);
        point2 = Vector.Add(point2,this.position);
        point3 = Vector.Add(point3,this.position);
        
        ctx.fillStyle = "#" + this.ToHex(Math.floor(255 - 255*this.health)) + this.ToHex(Math.floor(255*this.health)) + "00";
        ctx.beginPath();
        ctx.moveTo(point1.x,point1.y);
        ctx.lineTo(point2.x,point2.y);
        ctx.lineTo(point3.x,point3.y);
        ctx.lineTo(point1.x,point1.y);
        ctx.fill();

        if (SHOWATTRIBUTES)
        {

            ctx.strokeStyle = "lime";
            ctx.beginPath();
            ctx.arc(this.position.x,this.position.y,this.dna[2],0,2*Math.PI,true);
            ctx.stroke();
    
            ctx.strokeStyle = "red";
            ctx.beginPath();
            ctx.arc(this.position.x,this.position.y,this.dna[3],0,2*Math.PI,true);
            ctx.stroke();
    
            ctx.fillStyle = "lime";
            if (this.dna[0] > 0)
            {
                ctx.fillRect(this.position.x,this.position.y - this.r*3,10*Math.abs(this.dna[0]),this.r/3);
            }
            else
            {
                ctx.fillRect(this.position.x + 10*this.dna[0], this.position.y - this.r*3, 10*Math.abs(this.dna[0]),this.r/3)
            }
    
            ctx.fillStyle = "red";
            if (this.dna[1] > 0)
            {
                ctx.fillRect(this.position.x,this.position.y - this.r*2 - this.r/3,10*Math.abs(this.dna[1]),this.r/3);
            }
            else
            {
                ctx.fillRect(this.position.x + 10*this.dna[1], this.position.y - this.r*2 - this.r/3, 10*Math.abs(this.dna[1]),this.r/3)
            }
    
            ctx.fillStyle = "white";
            ctx.fillRect(this.position.x - this.r/6,this.position.y - this.r*3.5,this.r/3,this.r*2);
        }



    }

    ToHex = function(x)
    {
        var digits = ["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f"];
        var str = digits[(x % 16)];
        x = Math.floor(x/16);
        str = digits[x] + str;
        return str;
    }

    Boundaries(width, height) {
        var d = 15;
        let desired = null;
    
        if (this.position.x < d) {
          desired = new Vector(this.maxSpeed, this.velocity.y);
        } else if (this.position.x > width - d) {
          desired = new Vector(-this.maxSpeed, this.velocity.y);
        }
    
        if (this.position.y < d) {
          desired = new Vector(this.velocity.x, this.maxSpeed);
        } else if (this.position.y > height - d) {
          desired = new Vector(this.velocity.x, -this.maxSpeed);
        }
    

        if (desired != null) {
          desired = Vector.Normalise(desired);
          desired = Vector.Scale(desired,this.maxSpeed);
          let steer = Vector.Subtract(desired, this.velocity);
          steer = Vector.Limit(steer,this.maxForce*3);
          this.ApplyForce(steer);
        }
      }

}