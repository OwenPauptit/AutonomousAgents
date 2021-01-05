class Vector
{
    constructor(x,y)
    {
        this.x = x;
        this.y = y;
    }

    static Subtract = function(a,b)
    {
        return new Vector(a.x - b.x,a.y-b.y);
    }

    static Add = function(a,b)
    {
        return new Vector(a.x + b.x, a.y + b.y);
    }

    static Scale = function(a,m)
    {
        return new Vector(a.x * m, a.y * m);
    }

    static Length = function(a)
    {
        return Math.sqrt(a.x * a.x + a.y * a.y);
    }

    static LengthSquared = function(a)
    {
        return a.x * a.x + a.y * a.y;
    }

    static Normalise = function(a)
    {
        return Vector.Scale(a,1/Vector.Length(a));
    }

    static SetLength = function(a,l)
    {
        return Vector.Scale(Vector.Normalise(a),l);
    }

    static Limit = function(a,l)
    {
        if (Vector.LengthSquared(a) > l * l)
        {
            return Vector.SetLength(a,l);
        }
        return a;
    }

    static GetAngle = function(a)
    {
        return Math.atan2(a.x, -a.y) - Math.PI / 2;
    }


    static Rotate = function(a,theta)
    {
        var x2 = a.x * Math.cos(theta) - a.y * Math.sin(theta);
        var y2 = a.x * Math.sin(theta) + a.y * Math.cos(theta);
        return new Vector(x2,y2);
    }

}