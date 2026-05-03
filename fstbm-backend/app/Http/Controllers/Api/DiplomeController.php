<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Diplome;
use App\Models\Doctorant;
use Illuminate\Http\Request;

class DiplomeController extends Controller
{
    
    public function index()
    {
        $diplomes = Diplome::with('doctorant')->latest()->get();
        return response()->json($diplomes);
    }

    
    public function store(Request $request)
    {
        $validated = $request->validate([
            'doctorant_id' => 'required|exists:doctorants,id',
            'numero_diplome' => 'nullable|unique:diplomes',
            'mention_fr' => 'nullable|string',
            'mention_arb' => 'nullable|string',
            'date_examen' => 'nullable|date',
            'date_obtention' => 'nullable|date',
        ]);

        $diplome = Diplome::create($validated);

        return response()->json([
            'message' => 'Diplôme créé avec succès',
            'data' => $diplome->load('doctorant'),
        ], 201);
    }

   
    public function show($id)
    {
        $diplome = Diplome::with('doctorant')->findOrFail($id);
        return response()->json($diplome);
    }

  
    public function update(Request $request, $id)
    {
        $diplome = Diplome::findOrFail($id);

        $validated = $request->validate([
            'doctorant_id' => 'sometimes|required|exists:doctorants,id',
            'numero_diplome' => 'sometimes|nullable|unique:diplomes,numero_diplome,' . $id,
            'mention_fr' => 'nullable|string',
            'mention_arb' => 'nullable|string',
            'date_examen' => 'nullable|date',
            'date_obtention' => 'nullable|date',
            'status' => 'nullable|in:en_attente,approuve,rejete',
            'note_moyenne' => 'nullable|numeric|min:0|max:20',
            'observations' => 'nullable|string',
        ]);

        $diplome->update($validated);

        return response()->json([
            'message' => 'Diplôme mis à jour avec succès',
            'data' => $diplome->load('doctorant'),
        ]);
    }

    public function destroy($id)
    {
        $diplome = Diplome::findOrFail($id);
        $diplome->delete();

        return response()->json([
            'message' => 'Diplôme supprimé avec succès',
        ]);
    }

 
    public function byDoctorant($doctorantId)
    {
        $diplome = Diplome::where('doctorant_id', $doctorantId)
            ->with('doctorant')
            ->latest()
            ->get();

        return response()->json($diplome);
    }
}
