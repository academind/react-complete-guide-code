using System.Collections;
using System.Collections.Generic;
using UnityEngine;

[CreateAssetMenu(fileName = "New outfit", menuName = "Character/Outfit")]
public class Outfit : ScriptableObject{
    
	//holds all the outfit values
	public int hatType;
	public bool glasses;
	public bool female;
	public int hairType;
	
	public Material skin;
	public Material hatMat;
	public Material shirt;
	public Material pants;
	public Material shoes;
	public Material racket;
	public Material hair;
}
