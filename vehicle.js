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
    }

    Update()
    {
        console.log("here",this.position.x,this.position.y);
        this.velocity = Vector.Add(this.velocity,this.acceleration);
        this.velocity = Vector.Limit(this.velocity,this.maxSpeed);
        this.position = Vector.Add(this.position,this.velocity);
        this.acceleration = new Vector(0,0);
    }

    ApplyForce(force)
    {
        // Assume mass to be 1
        this.acceleration = Vector.Add(this.acceleration,force);
    }

    Seek(target)
    {
        let desired = Vector.Subtract(target,this.position);
        console.log(desired.x,desired.y);
        desired = Vector.SetLength(desired,this.maxSpeed);
        let steer = Vector.Subtract(desired,this.velocity);
        steer = Vector.Limit(steer,this.maxForce);
        this.ApplyForce(steer);
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

        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.moveTo(point1.x,point1.y);
        ctx.lineTo(point2.x,point2.y);
        ctx.lineTo(point3.x,point3.y);
        ctx.lineTo(point1.x,point1.y);
        ctx.fill();
    }


}