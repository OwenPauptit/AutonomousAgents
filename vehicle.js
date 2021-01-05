class Vehicle
{
    constructor(x,y)
    {
        this.position = new Vector(x,y);
        this.velocity = new Vector(Math.random()*8-4,Math.random()*8-4);
        this.acceleration = new Vector(0,0);
        this.r = 6;
        this.maxForce = 0.05;
        this.maxSpeed = 3.0;

        this.health = 1;

        this.dna = [];
        this.dna[0] = Math.random() * 10 - 5;
        this.dna[1] = Math.random() * 10 - 5;
    }

    Update()
    {
        this.health -= 0.001;
        if (this.health < 0)
        {
            this.health = 0;
        }
        if (this.health > 
            1)
        {
            this.health = 1;
        }
        this.velocity = Vector.Add(this.velocity,this.acceleration);
        this.velocity = Vector.Limit(this.velocity,this.maxSpeed);
        this.position = Vector.Add(this.position,this.velocity);
        this.acceleration = new Vector(0,0);
    }

    Behave(good, bad)
    {
        var steerG = this.Eat(good,0.3);
        var steerB = this.Eat(bad,-0.5);

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

    Eat(list,reward)
    {
        var closest = Infinity;
        var indexOfClosest = -1;
        for(var i = 0; i < list.length; i++)
        {
            var d = Vector.DistanceSquared(list[i],this.position);
            if (d < closest)
            {
                closest = d;
                indexOfClosest = i;
            }
        }
        if (closest <= 2* this.r)
        {
            list.splice(indexOfClosest,1);
            this.health += reward;
            //addFood();
        }
        else if (indexOfClosest >= 0)
        {
            return this.Seek(list[indexOfClosest]);
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
        
        console.log("#" + this.ToHex(Math.floor(255 - 255*this.health)) + this.ToHex(Math.floor(255*this.health)) + "00");
        ctx.fillStyle = "#" + this.ToHex(Math.floor(255 - 255*this.health)) + this.ToHex(Math.floor(255*this.health)) + "00";
        ctx.beginPath();
        ctx.moveTo(point1.x,point1.y);
        ctx.lineTo(point2.x,point2.y);
        ctx.lineTo(point3.x,point3.y);
        ctx.lineTo(point1.x,point1.y);
        ctx.fill();

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

    ToHex = function(x)
    {
        var digits = ["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f"];
        var str = digits[(x % 16)];
        x = Math.floor(x/16);
        str = digits[x] + str;
        return str;
    }


}